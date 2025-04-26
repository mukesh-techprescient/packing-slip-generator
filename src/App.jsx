import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"; // Added useNavigate
import { incrementPackageNumber } from "./utils";
import { generateSummaryPDF, generatePackingPDF, generateCombinedPDF } from "./pdfGenerator";
import { PACKAGE_PREFIX } from "./constants";

import InputsSection from "./components/InputsSection";
import PackingTable from "./components/PackingTable";
import FooterActions from "./components/FooterActions";
import Login from "./pages/Login"; // Correct import path

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("user"));

  const [firmName, setFirmName] = useState("Sujata Trading Company");
  const [customerName, setCustomerName] = useState("");
  const [designNo, setDesignNo] = useState("");
  const [setNo, setSetNo] = useState("");
  const [wayBillNo, setWayBillNo] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [enterPressedForNewRow, setEnterPressedForNewRow] = useState(false);
  const [rows, setRows] = useState([]);

  const qtyRefs = useRef([]);

  useEffect(() => {
    if (enterPressedForNewRow) {
      const lastRef = qtyRefs.current[rows.length - 1];
      if (lastRef) setTimeout(() => lastRef.focus(), 0);
      setEnterPressedForNewRow(false);
    }
  }, [rows, enterPressedForNewRow]);

  const addRow = () => {
    const lastRow = rows[rows.length - 1];
    const newPackageNumber = lastRow
      ? incrementPackageNumber(lastRow.packageNumber, wayBillNo, PACKAGE_PREFIX)
      : (wayBillNo ? `${PACKAGE_PREFIX}-${wayBillNo}-001` : `${PACKAGE_PREFIX}-001`);

    const newRow = {
      packageNumber: newPackageNumber,
      itemName: lastRow?.itemName || "",
      taga: lastRow?.taga || 1,
      qty: null
    };
    setRows([...rows, newRow]);
  };

  const additem = () => {
    const lastRow = rows[rows.length - 1];
    const newPackageNumber = lastRow ? lastRow.packageNumber : `${PACKAGE_PREFIX}-001`;
    const newRow = {
      packageNumber: newPackageNumber,
      itemName: lastRow?.itemName || "",
      taga: lastRow?.taga || 1,
      qty: null
    };
    setRows([...rows, newRow]);
  };

  const updateRow = (index, key, value) => {
    const updated = [...rows];
    updated[index][key] = value;
    setRows(updated);
  };

  const removeRow = (index) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };

  const addSubItem = (index) => {
    const rowToCopy = rows[index];
    const newRow = {
      packageNumber: rowToCopy.packageNumber,
      itemName: rowToCopy.itemName,
      taga: rowToCopy.taga,
      qty: null,
    };

    const updated = [...rows];
    updated.splice(index + 1, 0, newRow);
    setRows(updated);
  };

  const handleEnterInQty = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setEnterPressedForNewRow(true);
      addRow();
    }
  };

  const handleGenerateSummaryPDF = () => {
    generateSummaryPDF({ rows, firmName, customerName, designNo, wayBillNo, date });
  };

  const handleGeneratePackingPDF = () => {
    generatePackingPDF({ rows, firmName, customerName, designNo, date });
  };

  const handleGenerateCombinedPDF = () => {
    generateCombinedPDF({ rows, firmName, customerName, designNo, wayBillNo, date });
  };

  const handleRenumber = () => {
    const wb = wayBillNo.trim();
    let counter = 1;
    const updated = rows.map((row) => {
      const newPkg = wb
        ? `${PACKAGE_PREFIX}-${wb}-${counter.toString().padStart(3, "0")}`
        : `${PACKAGE_PREFIX}-${counter.toString().padStart(3, "0")}`;
      counter++;
      return { ...row, packageNumber: newPkg };
    });
    setRows(updated);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  const totalQty = rows.reduce((sum, r) => sum + (parseFloat(r.qty) || 0), 0);
  const totalTaga = rows.reduce((sum, r) => sum + (parseFloat(r.taga) || 0), 0);

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? (
          <div className="container">
            {/* Header with Email and Logout */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>Logged in as: <strong>{user.email}</strong></div>
              <button onClick={handleLogout} style={{ padding: "5px 10px", background: "#f44336", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                Logout
              </button>
            </div>

            <h3>Sujata - Packing Slip</h3>
            <InputsSection {...{ date, setDate, wayBillNo, setWayBillNo, designNo, setDesignNo, setNo, setSetNo, customerName, setCustomerName, firmName, setFirmName }} />
            <PackingTable {...{ rows, updateRow, removeRow, addSubItem, handleEnterInQty, qtyRefs }} />
            <FooterActions {...{ totalTaga, totalQty, addRow, additem, handleGeneratePackingPDF, handleGenerateSummaryPDF, handleGenerateCombinedPDF, handleRenumber }} />
          </div>
        ) : (
          <Navigate to="/login" />
        )}
      />
        <Route path="/login" element={<Login setUser={setUser} setIsAuthenticated={setIsAuthenticated} />} />

    </Routes>
  );
}

export default App;
