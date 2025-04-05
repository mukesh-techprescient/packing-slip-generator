import React, { useState } from "react";
import { incrementPackageNumber, groupByPackage } from "./utils";
import { generateSummaryPDF,generatePackingPDF,generateCombinedPDF} from "./pdfGenerator";


function App() {
  const [firmName, setFirmName] = useState("Sujata Trading Company");
  const [customerName, setCustomerName] = useState("Motilal Fabrics");
  const [designNo, setDesignNo] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [rows, setRows] = useState([
    { packageNumber: "BN-001", itemName: " ", taga: 1, qty: 10 },
  ]);


  
  const addRow = () => {
    const lastRow = rows[rows.length - 1];
    const newPackageNumber = lastRow ? incrementPackageNumber(lastRow.packageNumber) : "PKG001";

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
    const newPackageNumber = lastRow ? lastRow.packageNumber : "BN-001";

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



  const handleGenerateSummaryPDF = () => {
    generateSummaryPDF({
      rows,
      firmName,
      customerName,
      designNo,
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
      date
    });
  };

  return (
    <div className="container">
      <h2>Packing Slip PDF Generator</h2>

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
                  onChange={(e) => updateRow(i, "packageNumber", e.target.value)}
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
                />
              </td>
              <td>
                <button onClick={() => removeRow(i)}>✖</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="actions">
        <button className="add" onClick={addRow}>➕ New Package</button>
        <button className="add" onClick={additem}>➕ Add item</button>
        <button className="generate" onClick={handleGeneratePackingPDF}>📄 Generate PDF</button>
        <button className="summary" onClick={handleGenerateSummaryPDF}>📊 Generate Summary PDF</button>
        <button className="combined" onClick={handleGenerateCombinedPDF}>🧾 Generate Combined PDF</button>

      </div>
    </div>
  );
}


export default App;
