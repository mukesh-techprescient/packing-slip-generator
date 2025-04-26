import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom"; // 👈 ADD useParams for Edit
import InputsSection from "../components/InputsSection";
import PackingTable from "../components/PackingTable";
import FooterActions from "../components/FooterActions";
import { incrementPackageNumber } from "../utils";
import { generateSummaryPDF, generatePackingPDF, generateCombinedPDF } from "../pdfGenerator";
import { PACKAGE_PREFIX } from "../constants";
import {  getSlip, updateSlip, createSlip,getFirms} from "../api"; // 👈 Import APIs

const PackingSlipPage = ({ user, handleLogout }) => {
  const { id } = useParams(); // 👈 ID from URL if editing
  const navigate = useNavigate();
  const [slipId, setSlipId] = useState(null); // store slip id if editing

  const [firmName, setFirmName] = useState("Sujata Trading Company");
  const [customerName, setCustomerName] = useState("");
  const [designNo, setDesignNo] = useState("");
  const [setNo, setSetNo] = useState("");
  const [wayBillNo, setWayBillNo] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [enterPressedForNewRow, setEnterPressedForNewRow] = useState(false);
  const [rows, setRows] = useState([]);
  const qtyRefs = useRef([]);
  const [firms, setFirms] = useState([]); // 👈 All firms


  useEffect(() => {
    loadFirms();
    if (id) {
      loadSlip(id); // load existing slip if editing
    }
  }, [id]);


  const loadFirms = async () => {
    const allFirms = await getFirms();
    console.log("Fetched firms:", allFirms);  // 👈 Add this
    setFirms(allFirms || []);
      // 👉 Set default firm if firmName is not already set
  if ((!firmName || firmName === "") && allFirms.length > 0) {
    setFirmName(allFirms[0].firmName);
  }
  };

  const loadSlip = async (id) => {
    const existingSlip = await getSlip(id);
    if (existingSlip) {
      setSlipId(existingSlip.id);
      setFirmName(existingSlip.firmName);
      setCustomerName(existingSlip.customerName);
      setDesignNo(existingSlip.designNo);
      setDate(existingSlip.date);
      setWayBillNo(existingSlip.wayBillNo);
      setSetNo(existingSlip.setNo);

      const transformedRows = existingSlip.packages.flatMap((pkg) => {
        return pkg.items.map((item) => ({
          packageNumber: pkg.packageNumber,
          itemName: item.itemName,
          taga: item.taga,
          qty: item.qty,
        }));
      });
  
      setRows(transformedRows); 

    }
  };

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

    const newRow = { packageNumber: newPackageNumber, itemName: lastRow?.itemName || "", taga: lastRow?.taga || 1, qty: null };
    setRows([...rows, newRow]);
  };

  const additem = () => {
    const lastRow = rows[rows.length - 1];
    const newRow = { packageNumber: lastRow?.packageNumber || `${PACKAGE_PREFIX}-001`, itemName: lastRow?.itemName || "", taga: lastRow?.taga || 1, qty: null };
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
    const newRow = { packageNumber: rowToCopy.packageNumber, itemName: rowToCopy.itemName, taga: rowToCopy.taga, qty: null };
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

  const handleGenerateSummaryPDF = () => generateSummaryPDF({ rows, firmName, customerName, designNo, wayBillNo, date });
  const handleGeneratePackingPDF = () => generatePackingPDF({ rows, firmName, customerName, designNo, date });
  const handleGenerateCombinedPDF = () => generateCombinedPDF({ rows, firmName, customerName, designNo, wayBillNo, date });

  const handleSaveSlip = async () => {
    // Transform rows back into packages
    const packageMap = {};
  
    rows.forEach((row) => {
      if (!packageMap[row.packageNumber]) {
        packageMap[row.packageNumber] = {
          packageNumber: row.packageNumber,
          items: [],
        };
      }
      packageMap[row.packageNumber].items.push({
        itemName: row.itemName,
        taga: row.taga,
        qty: row.qty,
      });
    });
  
    const packages = Object.values(packageMap);
  
    const slipData = {
      id,
      firmName,
      customerName,
      designNo,
      date,
      wayBillNo,
      setNo,
      totalTaga: rows.reduce((sum, row) => sum + parseFloat(row.taga || 0), 0),
      totalQty: rows.reduce((sum, row) => sum + parseFloat(row.qty || 0), 0),
      packages, // <<-- important: saving in packages format now
    };
  
    if (slipId) {
      await updateSlip(slipData);
      alert("Slip updated successfully!");
    } else {
      await createSlip(slipData);
      alert("Slip saved successfully!");
    }
    navigate("/");
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

  const totalQty = rows.reduce((sum, r) => sum + (parseFloat(r.qty) || 0), 0);
  const totalTaga = rows.reduce((sum, r) => sum + (parseFloat(r.taga) || 0), 0);

  return (
    <div className="container">
    {/* Header with Home and Logout */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <div>Logged in as: <strong>{user?.email}</strong></div>
      <div>
        <button 
          onClick={() => navigate("/")} 
          style={{ marginRight: "10px", padding: "5px 10px", background: "#1976d2", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Home
        </button>
        <button 
          onClick={handleLogout} 
          style={{ padding: "5px 10px", background: "#f44336", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Logout
        </button>
      </div>
    </div>



      <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <span>Sujata - Packing Slip {slipId ? "(Edit Mode)" : "(New)"}</span>
  <select
  value={firmName}
  onChange={(e) => setFirmName(e.target.value)}
  style={{ marginLeft: '10px', padding: '5px', fontSize: '16px' }}
>
  <option value="">Select Firm</option>
  {firms.map((firm) => (
    <option key={firm.id} value={firm.firmName}>
      {firm.firmName}
    </option>
  ))}
</select>

</h3>


      {/* Main Body */}
      <InputsSection {...{ date, setDate, wayBillNo, setWayBillNo, designNo, setDesignNo, setNo, setSetNo, customerName, setCustomerName, firmName, setFirmName}} />
      <PackingTable {...{ rows, updateRow, removeRow, addSubItem, handleEnterInQty, qtyRefs }} />
      <FooterActions {...{ totalTaga, totalQty, addRow, additem, handleGeneratePackingPDF, handleGenerateSummaryPDF, handleGenerateCombinedPDF, handleRenumber, handleSaveSlip }} />
    </div>
  );
};

export default PackingSlipPage;
