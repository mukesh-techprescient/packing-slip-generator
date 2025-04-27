import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table";
import { listSlips, deleteSlip } from "../api";
import { generatePackingPDF, generateSummaryPDF } from "../pdfGenerator";
import { FaEye, FaTrash, FaFilePdf, FaPrint } from "react-icons/fa"; // 👈 Import FontAwesome icons
import { Tooltip } from "react-tooltip"; // Correct named import for react-tooltip
import { formatDate } from "../utils"; // Adjust the path as necessary


const SlipList = () => {
  const navigate = useNavigate();
  const [slips, setSlips] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetchSlips();
  }, []);

  const fetchSlips = async () => {
    const data = await listSlips();
    setSlips(data);
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

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 60,
        cell: (info) => <div style={{ textAlign: "center" }}>{info.getValue()}</div>,
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <div style={{ textAlign: "center" }}>
            {formatDate(row.original.date)} {/* Apply formatDate here */}
          </div>
        ),
      },
      {
        accessorKey: "wayBillNo",
        header: "Waybill No",
      },
      {
        accessorKey: "firmName",
        header: "Firm Name",
      },
      {
        accessorKey: "customerName",
        header: "Customer Name",
      },
      {
        accessorKey: "totalQty",
        header: "Total Meter",
      },
      {
        accessorKey: "totalTaga",
        header: "Total Taga",
      },
      {
        accessorKey: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => (
          <div style={{ display: "flex", gap: "8px" }}>
            {/* View Button */}
            <div
              data-tip="View Slip" // Tooltip target
              onClick={() => navigate(`/slips/${row.original.id}`)}
              style={{
                fontSize: "20px",
                cursor: "pointer",
                color: "#616161", // Subtle gray color
              }}
            >
              <FaEye />
            </div>

            {/* Delete Button */}
            <div
              data-tip="Delete Slip" // Tooltip target
              onClick={() => handleDelete(row.original.id)}
              style={{
                fontSize: "20px",
                cursor: "pointer",
                color: "#d32f2f", // A muted red color
              }}
            >
              <FaTrash />
            </div>

            {/* Print Packing PDF Button */}
            <div
              data-tip="Print Packing Slip" // Tooltip target
              onClick={() => handleGeneratePackingPDF(row.original)}
              style={{
                fontSize: "20px",
                cursor: "pointer",
                color: "#1976d2", // Muted blue color
              }}
            >
              <FaFilePdf />
            </div>

            {/* Print Summary Button */}
            <div
              data-tip="Print Summary" // Tooltip target
              onClick={() => handleGenerateSummaryPDF(row.original)}
              style={{
                fontSize: "20px",
                cursor: "pointer",
                color: "#FF7043", // Muted orange color
              }}
            >
              <FaPrint />
            </div>

            {/* Tooltip rendering */}
            <Tooltip />
          </div>
        ),
      },
    ],
    [navigate]
  );

  const table = useReactTable({
    data: slips,
    columns,
    state: {
      globalFilter,
      sorting,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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

      {/* Buttons Row */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
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

        {/* Global Search */}
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

      {/* Table */}
      <table
        border="1"
        cellPadding="4"
        style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}
      >
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
      <div>
        <button onClick={() => table.setPageIndex(0)}>{"<<"}</button>
        <button onClick={() => table.setPageIndex(table.getState().pagination.pageIndex - 1)}>
          {"<"}
        </button>
        <button onClick={() => table.setPageIndex(table.getState().pagination.pageIndex + 1)}>
          {">"}
        </button>
        <button onClick={() => table.setPageIndex(table.getPageCount() - 1)}>{">>"}</button>
      </div>
    </div>
  );
};

export default SlipList;
