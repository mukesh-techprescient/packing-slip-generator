import React, { useState } from "react";

function App() {
  const [firmName, setFirmName] = useState("Sujata Textiles");
  const [customerName, setCustomerName] = useState("Motilal Fabrics");
  const [designNo, setDesignNo] = useState("D1234");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [rows, setRows] = useState([
    { packageNumber: "PKG001", itemName: "Cotton Saree", taga: 1, qty: 10 },
    { packageNumber: "PKG001", itemName: "Silk Saree", taga: 2, qty: 5 },
    { packageNumber: "PKG002", itemName: "Linen Saree", taga: 1, qty: 8 },
  ]);

  const addRow = () => {
    const lastRow = rows[rows.length - 1];
    const newRow = {
      packageNumber: lastRow?.packageNumber || "",
      itemName: lastRow?.itemName || "",
      taga: lastRow?.taga || 1,
      qty: 1
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

  const groupByPackage = (data) => {
    return data.reduce((acc, item) => {
      const key = item.packageNumber;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  };

  const generatePDF = () => {
    const grouped = groupByPackage(rows);
    const popup = window.open("", "_blank");

    popup.document.write(`
      <html>
        <head>
          <title>Packing Slips PDF</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            .page { display: flex; flex-wrap: wrap; page-break-after: always; }
            .slip {
              width: 48%;
              border: 1px solid #ccc;
              border-radius: 8px;
              padding: 12px;
              margin: 1%;
              box-sizing: border-box;
              background: white;
            }
            .firm-details {
              font-size: 12px;
              text-align: center;
              margin-bottom: 8px;
              line-height: 1.4;
            }
            .firm-details strong {
              font-size: 14px;
              display: block;
            }
            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 1px solid #ddd;
              padding-bottom: 8px;
              margin-bottom: 8px;
            }
            .logo { height: 40px; }
            .info { font-size: 14px; margin-bottom: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 14px; }
            th { background-color: #f0f0f0; }
            .footer { margin-top: 10px; font-size: 12px; text-align: right; }
            @media print {
              .page { page-break-after: always; }
            }
          </style>
        </head>
        <body>
    `);

    const pkgNumbers = Object.keys(grouped);
    for (let i = 0; i < pkgNumbers.length; i += 6) {
      popup.document.write(`<div class="page">`);
      const group = pkgNumbers.slice(i, i + 6);
      group.forEach((pkgNum) => {
        const items = grouped[pkgNum];
        const totalQty = items.reduce((sum, item) => sum + Number(item.qty), 0);
        popup.document.write(`
          <div class="slip">
            <div class="firm-details">
              <strong>${firmName.toUpperCase()}</strong>
              10/214, Behind Radhakrishna Theatre,<br />
              ICHALKARANJI -416 115. ® (0230) 2436904
            </div>
            <div class="info"><strong>Date:</strong> ${date}</div>
            <div class="info"><strong>Design No.:</strong> ${designNo}</div>
            <div class="info"><strong>Customer:</strong> ${customerName}</div>
            <div class="info"><strong>Package #:</strong> ${pkgNum}</div>
            <table>
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Item Name</th>
                  <th>Taga</th>
                  <th>Mtrs</th>
                </tr>
              </thead>
              <tbody>
                ${items
                  .map(
                    (item, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>${item.itemName}</td>
                    <td>${item.taga}</td>
                    <td>${item.qty}</td>
                  </tr>
                `
                  )
                  .join("")}
                <tr>
                  <td colspan="3"><strong>Total</strong></td>
                  <td><strong>${totalQty}</strong></td>
                </tr>
              </tbody>
            </table>
            <div class="footer">Signature: _______________________</div>
          </div>
        `);
      });
      popup.document.write(`</div>`);
    }

    popup.document.write(`
        </body>
        <script>
          window.onload = () => setTimeout(() => {
            window.print();
            window.onafterprint = () => window.close();
          }, 500);
        </script>
      </html>
    `);
    popup.document.close();
  };

  const generateSummaryPDF = () => {
    const grouped = groupByPackage(rows);
    const popup = window.open("", "_blank");

    popup.document.write(`
      <html>
        <head>
          <title>Summary Report</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h2 { text-align: center; }
            .firm-name { text-align: center; font-weight: bold; margin-bottom: 8px; }
            .customer-name { text-align: center; margin-bottom: 8px; font-size: 14px; }
            .meta { text-align: center; margin-bottom: 20px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { border: 1px solid #ddd; padding: 6px; font-size: 14px; text-align: left; }
            th { background-color: #f0f0f0; }
          </style>
        </head>
        <body>
          <div class="firm-name">${firmName}</div>
          <div class="customer-name">Customer: ${customerName}</div>
          <div class="meta">Design No: ${designNo} | Date: ${date}</div>
    `);

    Object.keys(grouped).forEach(pkg => {
      popup.document.write(`
        <h3>Package: ${pkg}</h3>
        <table>
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Item Name</th>
              <th>Taga</th>
              <th>Mtrs</th>
            </tr>
          </thead>
          <tbody>
            ${grouped[pkg].map((item, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td>${item.itemName}</td>
                <td>${item.taga}</td>
                <td>${item.qty}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `);
    });

    popup.document.write(`
        </body>
        <script>
          window.onload = () => setTimeout(() => {
            window.print();
            window.onafterprint = () => window.close();
          }, 500);
        </script>
      </html>
    `);
    popup.document.close();
  };

  const generateCombinedPDF = () => {
    const grouped = groupByPackage(rows);
    const popup = window.open("", "_blank");
  
    popup.document.write(`
      <html>
        <head>
          <title>Combined Report</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h2 { text-align: center; }
            .firm-name { text-align: center; font-weight: bold; margin-bottom: 8px; }
            .customer-name { text-align: center; margin-bottom: 20px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { border: 1px solid #ddd; padding: 6px; font-size: 14px; text-align: left; }
            th { background-color: #f0f0f0; }
  
            .page { display: flex; flex-wrap: wrap; page-break-after: always; }
            .slip {
              width: 48%;
              border: 1px solid #ccc;
              border-radius: 8px;
              padding: 12px;
              margin: 1%;
              box-sizing: border-box;
              background: white;
            }
            .firm-details {
              font-size: 12px;
              text-align: center;
              margin-bottom: 8px;
              line-height: 1.4;
            }
            .firm-details strong {
              font-size: 14px;
              display: block;
            }
            .info { font-size: 14px; margin-bottom: 4px; }
            .footer { margin-top: 10px; font-size: 12px; text-align: right; }
          </style>
        </head>
        <body>
          <div class="firm-name">${firmName}</div>
          <div class="customer-name">Customer: ${customerName}</div>
    `);
  
    // Summary Table Section
    Object.keys(grouped).forEach(pkg => {
      popup.document.write(`
        <h3>Package: ${pkg}</h3>
        <table>
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Item Name</th>
              <th>Taga</th>
              <th>Mtrs</th>
            </tr>
          </thead>
          <tbody>
            ${grouped[pkg].map((item, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td>${item.itemName}</td>
                <td>${item.taga}</td>
                <td>${item.qty}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `);
    });
  
    // Packing Slips Section
    const pkgNumbers = Object.keys(grouped);
    for (let i = 0; i < pkgNumbers.length; i += 6) {
      popup.document.write(`<div class="page">`);
      const group = pkgNumbers.slice(i, i + 6);
      group.forEach((pkgNum) => {
        const items = grouped[pkgNum];
        const totalQty = items.reduce((sum, item) => sum + Number(item.qty), 0);
        popup.document.write(`
          <div class="slip">
            <div class="firm-details">
              <strong>${firmName.toUpperCase()}</strong>
              10/214, Behind Radhakrishna Theatre,<br />
              ICHALKARANJI -416 115. ® (0230) 2436904
            </div>
            <div class="info"><strong>Date:</strong> ${date}</div>
            <div class="info"><strong>Design No.:</strong> ${designNo}</div>
            <div class="info"><strong>Customer:</strong> ${customerName}</div>
            <div class="info"><strong>Package #:</strong> ${pkgNum}</div>
            <table>
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Item Name</th>
                  <th>Taga</th>
                  <th>Mtrs</th>
                </tr>
              </thead>
              <tbody>
                ${items
                  .map(
                    (item, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>${item.itemName}</td>
                    <td>${item.taga}</td>
                    <td>${item.qty}</td>
                  </tr>
                `
                  )
                  .join("")}
                <tr>
                  <td colspan="3"><strong>Total</strong></td>
                  <td><strong>${totalQty}</strong></td>
                </tr>
              </tbody>
            </table>
            <div class="footer">Signature: _______________________</div>
          </div>
        `);
      });
      popup.document.write(`</div>`);
    }
  
    popup.document.write(`
        </body>
        <script>
          window.onload = () => setTimeout(() => {
            window.print();
            window.onafterprint = () => window.close();
          }, 500);
        </script>
      </html>
    `);
  
    popup.document.close();
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
        <button className="add" onClick={addRow}>➕ Add Row</button>
        <button className="generate" onClick={generatePDF}>📄 Generate PDF</button>
        <button className="summary" onClick={generateSummaryPDF}>📊 Generate Summary PDF</button>
        <button className="combined" onClick={generateCombinedPDF}>🧾 Generate Combined PDF</button>

      </div>
    </div>
  );
}


export default App;
