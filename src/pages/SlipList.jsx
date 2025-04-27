import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { listSlips, deleteSlip } from "../api";

const SlipList = () => {
  const navigate = useNavigate();
  const [slips, setSlips] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10, // show 5 items per page
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

  const handleLogout = () => {
    navigate("/login");
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 60, // smaller column for ID
        cell: (info) => <div style={{ textAlign: "center" }}>{info.getValue()}</div>,
      },
      {
        accessorKey: "date",
        header: "Date",
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
        accessorKey: "totalMeter",
        header: "Total Meter",
      },
      {
        accessorKey: "totalTaga",
        header: "Total Taga",
      },
      // {
      //   accessorKey: "designNo",
      //   header: "Design No",
      // },
      // {
      //   accessorKey: "setNo",
      //   header: "Set No",
      // },
      {
        accessorKey: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => (
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => navigate(`/slips/${row.original.id}`)}
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
              View
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              style={{
                padding: "4px 8px",
                fontSize: "12px",
                color: "red",
                border: "none",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
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
          onClick={handleLogout}
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
                  {header.column.getIsSorted() === "asc" && " 🔼"}
                  {header.column.getIsSorted() === "desc" && " 🔽"}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} style={{ padding: "6px", fontSize: "12px" }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} align="center" style={{ padding: "10px" }}>
                No slips found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            style={{
              padding: "4px 8px",
              fontSize: "12px",
              backgroundColor: "#f1f1f1",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            style={{
              padding: "4px 8px",
              fontSize: "12px",
              backgroundColor: "#f1f1f1",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlipList;
