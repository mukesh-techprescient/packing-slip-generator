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
  const PACKAGE_PREFIX = "STC";

  const [firmName, setFirmName] = useState("Sujata Trading Company");
  const [customerName, setCustomerName] = useState("");
  const [designNo, setDesignNo] = useState("");
  const [setNo, setSetNo] = useState("");
  const [wayBillNo, setWayBillNo] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [enterPressedForNewRow, setEnterPressedForNewRow] = useState(false);

  const [rows, setRows] = useState([
  ]);

  const qtyRefs = useRef([]);

  useEffect(() => {
    if (enterPressedForNewRow) {
      const lastRef = qtyRefs.current[rows.length - 1];
      if (lastRef) {
        setTimeout(() => lastRef.focus(), 0);
      }
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

  const handleRenumber = () => {
    const prefix = PACKAGE_PREFIX;
    const wb = wayBillNo.trim();
    const seen = new Set();
    let counter = 1;

    const updated = rows.map((row) => {
      let newPkg;
      if (!seen.has(row.packageNumber)) {
        newPkg = wb
          ? `${prefix}-${wb}-${counter.toString().padStart(3, "0")}`
          : `${prefix}-${counter.toString().padStart(3, "0")}`;
        seen.add(row.packageNumber);
        counter++;
      } else {
        newPkg = Array.from(seen).find((val, i) => {
          const basePkg = wb
            ? `${prefix}-${wb}-${(i + 1).toString().padStart(3, "0")}`
            : `${prefix}-${(i + 1).toString().padStart(3, "0")}`;
          return val === row.packageNumber && basePkg;
        });
      }
      return { ...row, packageNumber: newPkg };
    });

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

  const additem = () => {
    const lastRow = rows[rows.length - 1];
    const newPackageNumber = lastRow ? lastRow.packageNumber : "STC-001";

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

  const handleEnterInQty = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setEnterPressedForNewRow(true);
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
      <h3>Sujata - Packing Slip</h3>

<div className="inputs-container compact-inputs">

  <input
    type="date"
    value={date}
    onChange={(e) => setDate(e.target.value)}
    placeholder="Date"
  />

  <input
    value={wayBillNo}
    onChange={(e) => setWayBillNo(e.target.value)}
    placeholder="Waybill No."
  />

<input
    value={designNo}
    onChange={(e) => setDesignNo(e.target.value)}
    placeholder="Design No."
  />

<input
    value={setNo}
    onChange={(e) => setSetNo(e.target.value)}
    placeholder="Set No."
  />


<input
    value={customerName}
    onChange={(e) => setCustomerName(e.target.value)}
    placeholder="Customer Name"
  />
      <input
    value={firmName}
    onChange={(e) => setFirmName(e.target.value)}
    placeholder="Firm Name"
  />
</div>


      <div className="table-scroll">
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
            {(() => {
              const grouped = rows.reduce((acc, row, i) => {
                const key = row.packageNumber;
                if (!acc[key]) acc[key] = [];
                acc[key].push({ ...row, index: i });
                return acc;
              }, {});

              return Object.entries(grouped).flatMap(([pkg, groupRows]) => {
                return groupRows.map((row, idx) => (
                  <tr key={row.index}>
                    {idx === 0 && (
                      <td rowSpan={groupRows.length}>
                        <input
                          value={row.packageNumber}
                          onChange={(e) => updateRow(row.index, "packageNumber", e.target.value)}
                        />
                      </td>
                    )}
                    <td>
                      <input
                        value={row.itemName}
                        onChange={(e) => updateRow(row.index, "itemName", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min={1}
                        value={row.taga}
                        onChange={(e) => updateRow(row.index, "taga", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min={1}
                        value={row.qty}
                        onChange={(e) => updateRow(row.index, "qty", e.target.value)}
                        onKeyDown={handleEnterInQty}
                        ref={(el) => (qtyRefs.current[row.index] = el)}
                      />
                    </td>
                    <td className="actions-cell">
                      <button onClick={() => removeRow(row.index)}>✖</button>
                      <button onClick={() => addSubItem(row.index)}>➕</button>
                    </td>
                  </tr>
                ));
              });
            })()}
          </tbody>
        </table>
      </div>

      <div className="footer-bar">
        <div className="footer-summary">
          Summary - <strong>Total Taga:</strong> {totalTaga} | <strong>Total Mtrs:</strong> {totalQty}
        </div>
        <div className="footer-actions">
          <button className="add" onClick={addRow}>➕ New Package</button>
          <button className="add" onClick={additem}>➕ Add item</button>
          <button className="generate" onClick={handleGeneratePackingPDF}>📄 Print Slip</button>
          <button className="summary" onClick={handleGenerateSummaryPDF}>📊 Print Summary</button>
          <button className="combined" onClick={handleGenerateCombinedPDF}>🧾 Print Both</button>
          <button className="renumber" onClick={handleRenumber}>🔢 Renumber</button>
        </div>
      </div>
    </div>
  );
}

export default App;