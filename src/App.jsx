import React, { useState } from "react";

function App() {
  const [firmName, setFirmName] = useState("Sujata Textiles");
  const [customerName, setCustomerName] = useState("Motilal Fabrics");
  const [designNo, setDesignNo] = useState("DSN001");
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [rows, setRows] = useState([
    { packageNumber: "PKG001", itemName: "Cotton Saree", qty: 10 },
    { packageNumber: "PKG001", itemName: "Silk Saree", qty: 5 },
    { packageNumber: "PKG002", itemName: "Linen Saree", qty: 8 },
  ]);

  const addRow = () => {
    setRows([...rows, { packageNumber: "", itemName: "", qty: 1 }]);
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
            body { font-family: Arial, sans-serif; padding: 20px; }
            .page { display: flex; flex-wrap: wrap; page-break-after: always; }
            .slip {
              width: 48%;
              border: 1px solid #000;
              padding: 10px;
              margin: 1%;
              box-sizing: border-box;
            }
            .header {
              text-align: center;
              font-weight: bold;
              font-size: 18px;
              margin-bottom: 10px;
              border-bottom: 1px solid #000;
              padding-bottom: 5px;
            }
            .info {
              font-size: 14px;
              margin: 4px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
              font-size: 14px;
            }
            th, td {
              border: 1px solid #000;
              padding: 5px;
              text-align: left;
            }
            th {
              background-color: #f0f0f0;
            }
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
        popup.document.write(`
          <div class="slip">
            <div class="header">Packing Slip</div>
            <div class="info"><strong>Firm:</strong> ${firmName}</div>
            <div class="info"><strong>Customer:</strong> ${customerName}</div>
            <div class="info"><strong>Package No:</strong> ${pkgNum}</div>
            <div class="info"><strong>Design No:</strong> ${designNo}</div>
            <div class="info"><strong>Date:</strong> ${date}</div>
            <table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                ${items
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.itemName}</td>
                    <td>${item.qty}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        `);
      });
      popup.document.write(`</div>`);
    }

    popup.document.write(`
        </body>
        <script>
          window.onload = () => setTimeout(() => window.print(), 500);
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
            <th>Qty</th>
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
      </div>
    </div>
  );
}

export default App;
