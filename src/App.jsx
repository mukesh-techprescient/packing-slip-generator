import React, { useState, useRef, useEffect } from "react";
import {
  incrementPackageNumber,
  groupByPackage
} from "./utils";
import {
  generateSummaryPDF,
  generatePackingPDF,
  generateCombinedPDF
} from "./pdfGenerator";

function App() {
  const [firmName, setFirmName] = useState("Sujata Trading Company");
  const [customerName, setCustomerName] = useState("Motilal Fabrics");
  const [designNo, setDesignNo] = useState("");
  const [wayBillNo, setWayBillNo] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [enterPressedForNewRow, setEnterPressedForNewRow] = useState(false);
  const bottomRef = useRef(null);



  const [rows, setRows] = useState([
    { packageNumber: "BN-001", itemName: " ", taga: 1, qty: 10 }
  ]);

  const qtyRefs = useRef([]);

/*   useEffect(() => {
    const lastRef = qtyRefs.current[rows.length - 1];
    if (lastRef) {
      setTimeout(() => lastRef.focus(), 0);
    }
  }, [rows]); */

  useEffect(() => {
    if (enterPressedForNewRow) {
      const lastRef = qtyRefs.current[rows.length - 1];
      if (lastRef) {
        setTimeout(() => lastRef.focus(), 0);
      }
      setEnterPressedForNewRow(false); // ✅ reset
    }
  }, [rows, enterPressedForNewRow]);

  const addRow = () => {
    const lastRow = rows[rows.length - 1];
    const newPackageNumber = lastRow
      ? incrementPackageNumber(lastRow.packageNumber)
      : "PKG001";

    const newRow = {
      packageNumber: newPackageNumber,
      itemName: lastRow?.itemName || "",
      taga: lastRow?.taga || 1,
      qty: null
    };
    setRows([...rows, newRow]);
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const additem = () => {
    const lastRow = rows[rows.length - 1];
    const newPackageNumber = lastRow ? lastRow.packageNumber : "BN-001";

    const newRow = {
      packageNumber: newPackageNumber,
      itemName: lastRow?.itemName || "",
      taga: lastRow?.taga || 1,
      qty: null
    };
    setRows([...rows, newRow]);
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
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

  const handleEnterInQty = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setEnterPressedForNewRow(true); // ✅ set before adding row
      addRow();
    }
  };

  const handleGenerateSummaryPDF = () => {
    generateSummaryPDF({
      rows,
      firmName,
      customerName,
      designNo,
      wayBillNo,
      date
    });
  };

  const handleGeneratePackingPDF = () => {
    generatePackingPDF({
      rows,
      firmName,
      customerName,
      designNo,
      date
    });
  };

  const handleGenerateCombinedPDF = () => {
    generateCombinedPDF({
      rows,
      firmName,
      customerName,
      designNo,
      wayBillNo,
      date
    });
  };

  const totalQty = rows.reduce((sum, r) => sum + (parseFloat(r.qty) || 0), 0);
const totalTaga = rows.reduce((sum, r) => sum + (parseFloat(r.taga) || 0), 0);

  return (
    <div className="container">
      <h2>Packing Slip Generator</h2>

      <div className="space-y-4">
        <input
          value={firmName}
          onChange={(e) => setFirmName(e.target.value)}
          placeholder="Firm Name"
        />
        <input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Customer Name"
        />
        <input
          value={designNo}
          onChange={(e) => setDesignNo(e.target.value)}
          placeholder="Design No."
        />
        <input
          value={wayBillNo}
          onChange={(e) => setWayBillNo(e.target.value)}
          placeholder="Way Bill No."
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Package #</th>
            <th>Item Name</th>
            <th>Taga</th>
            <th>Mtrs</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>
                <input
                  value={row.packageNumber}
                  onChange={(e) =>
                    updateRow(i, "packageNumber", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  value={row.itemName}
                  onChange={(e) => updateRow(i, "itemName", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  min={1}
                  value={row.taga}
                  onChange={(e) => updateRow(i, "taga", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  min={1}
                  value={row.qty}
                  onChange={(e) => updateRow(i, "qty", e.target.value)}
                  onKeyDown={handleEnterInQty}
                  ref={(el) => (qtyRefs.current[i] = el)}
                />
              </td>
              <td>
                <button onClick={() => removeRow(i)}>✖</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="totals">Summary - <strong>Total Taga:</strong> {totalTaga} | <strong>Total Mtrs:</strong> {totalQty}</div>


      <div className="actions">
        <button className="add" onClick={addRow}>
          ➕ New Package
        </button>
        <button className="add" onClick={additem}>
          ➕ Add item
        </button>
        <button className="generate" onClick={handleGeneratePackingPDF}>
          📄 Print Slip
        </button>
        <button className="summary" onClick={handleGenerateSummaryPDF}>
          📊 Print Summary
        </button>
        <button className="combined" onClick={handleGenerateCombinedPDF}>
          🧾 Print Both
        </button>
      </div>
    </div>
    
  );
}
<div ref={bottomRef} />

export default App;
