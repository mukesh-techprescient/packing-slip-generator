import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table";
import { listSlips, deleteSlip } from "../api";
import { generatePackingPDF, generateSummaryPDF } from "../pdfGenerator";
import { FaEye, FaTrash, FaFilePdf, FaPrint } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { formatDate } from "../utils";

const SlipList = () => {
  const navigate = useNavigate();
  const [slips, setSlips] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSlips();
  }, [page, pageSize, globalFilter]);

  const fetchSlips = async (retryCount = 0) => {
    try {
      setLoading(true);
      const response = await listSlips({ 
        page, 
        per_page: pageSize, 
        search: globalFilter // Pass the global filter for search
      });
      setSlips(response.slips);
      setTotalPages(Math.ceil(response.total / pageSize));
      setLoading(false);
    } catch (error) {
      console.error(`Fetch attempt ${retryCount + 1} failed`, error);
      if (retryCount < 5) {
        setTimeout(() => fetchSlips(retryCount + 1), 15000);
      } else {
        setLoading(false);
        alert("Failed to load slips after multiple attempts. Please try again later.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this slip?")) {
      await deleteSlip(id);
      fetchSlips();
    }
  };

  const handleGeneratePackingPDF = (slip) => {
    generatePackingPDF({
      rows: slip.packages.flatMap((pkg) => pkg.items.map((item) => ({
        packageNumber: pkg.packageNumber,
        itemName: item.itemName,
        taga: item.taga,
        qty: item.qty,
      }))),
      firmName: slip.firmName,
      customerName: slip.customerName,
      designNo: slip.designNo,
      wayBillNo: slip.wayBillNo,
      date: slip.date,
    });
  };

  const handleGenerateSummaryPDF = (slip) => {
    generateSummaryPDF({
      rows: slip.packages.flatMap((pkg) => pkg.items.map((item) => ({
        packageNumber: pkg.packageNumber,
        itemName: item.itemName,
        taga: item.taga,
        qty: item.qty,
      }))),
      firmName: slip.firmName,
      customerName: slip.customerName,
      designNo: slip.designNo,
      totalMeter: slip.totalQty,
      totalTaga: slip.totalTaga,
    });
  };

  const columns = useMemo(() => [
    { accessorKey: "id", header: "ID", size: 60, cell: (info) => <div style={{ textAlign: "center" }}>{info.getValue()}</div> },
    { accessorKey: "date", header: "Date", cell: ({ row }) => <div style={{ textAlign: "center" }}>{formatDate(row.original.date)}</div> },
    { accessorKey: "wayBillNo", header: "Waybill No" },
    { accessorKey: "firmName", header: "Firm Name" },
    { accessorKey: "customerName", header: "Customer Name" },
    {
      accessorKey: "totalQty",
      header: "Total Meter",
      cell: ({ row }) => {
        const qty = row.original.totalQty;
        const formattedQty = qty !== undefined && qty !== null ? Number(qty).toFixed(2) : "";
        return <div style={{ textAlign: "center" }}>{formattedQty}</div>;
      },
    },
    { accessorKey: "totalTaga", header: "Total Taga" },
    {
      accessorKey: "actions", header: "Actions", enableSorting: false,
      cell: ({ row }) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <div data-tip="View Slip" onClick={() => navigate(`/slips/${row.original.id}`)} style={{ fontSize: "20px", cursor: "pointer", color: "#616161" }}>
            <FaEye />
          </div>
          <div data-tip="Delete Slip" onClick={() => handleDelete(row.original.id)} style={{ fontSize: "20px", cursor: "pointer", color: "#d32f2f" }}>
            <FaTrash />
          </div>
          <div data-tip="Print Packing Slip" onClick={() => handleGeneratePackingPDF(row.original)} style={{ fontSize: "20px", cursor: "pointer", color: "#1976d2" }}>
            <FaFilePdf />
          </div>
          <div data-tip="Print Summary" onClick={() => handleGenerateSummaryPDF(row.original)} style={{ fontSize: "20px", cursor: "pointer", color: "#FF7043" }}>
            <FaPrint />
          </div>
          <Tooltip />
        </div>
      ),
    },
  ], [navigate]);

  const table = useReactTable({
    data: slips,
    columns,
    state: { globalFilter, sorting, pagination: { pageIndex: page - 1, pageSize } },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="container" style={{ padding: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "18px" }}>Sujata ERP</h2>
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "4px 8px",
            fontSize: "12px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Buttons and Loader */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", alignItems: "center" }}>
        <button
          onClick={() => navigate("/slips/new/slip")}
          style={{
            padding: "4px 8px",
            fontSize: "12px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          + Create Slip
        </button>

        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          style={{
            padding: "4px",
            fontSize: "12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "250px",
          }}
        />
      </div>

      {/* Loader */}
      {loading && (
        <div style={{ textAlign: "center", marginBottom: "10px", color: "#1976d2", fontWeight: "bold" }}>
          Loading slips, please wait...
        </div>
      )}

      {/* Table */}
      <table border="1" cellPadding="4" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{
                    cursor: header.column.getCanSort() ? "pointer" : "default",
                    background: "#f0f0f0",
                    textAlign: "left",
                    padding: "6px",
                    fontSize: "12px",
                  }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() ? (
                    <span>{header.column.getIsSorted() === "desc" ? " 🔽" : " 🔼"}</span>
                  ) : null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} style={{ padding: "8px", textAlign: "center" }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: "12px", display: "flex", justifyContent: "center", gap: "10px" }}>
        <button onClick={() => setPage(1)} disabled={page === 1}>{"<<"}</button>
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>{"<"}</button>
        <span style={{ fontSize: "12px", lineHeight: "24px" }}>Page {page} of {totalPages}</span>
        <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>{">"}</button>
        <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>{">>"}</button>
      </div>
    </div>
  );
};

export default SlipList;
