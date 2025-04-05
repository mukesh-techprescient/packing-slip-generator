import {  groupByPackage } from "./utils";

export const generateSummaryPDF = ({ rows, firmName, customerName, designNo, date, address }) => {
  const grouped = groupByPackage(rows);
  const popup = window.open("", "_blank");

  const formattedDate = new Date(date).toLocaleDateString();

  popup.document.write(`
    <html>
      <head>
        <title>Summary Report</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          .firm-details {
            text-align: center;
            font-size: 14px;
            line-height: 1.4;
            margin-bottom: 12px;
          }
          .firm-details strong {
            font-size: 16px;
            display: block;
          }
          .customer-name { text-align: center; font-size: 14px; margin-bottom: 4px; }
          .address { text-align: center; font-size: 13px; white-space: pre-line; margin-bottom: 10px; }
          .meta { text-align: center; font-size: 14px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { border: 1px solid #ddd; padding: 6px; font-size: 14px; text-align: left; }
          th { background-color: #f0f0f0; }
        </style>
      </head>
      <body>
        <div class="firm-details">
          <strong>${firmName.toUpperCase()}</strong>
          10/214, Behind Radhakrishna Theatre,<br />
          ICHALKARANJI -416 115. ® (0230) 2436904
        </div>
        <div class="customer-name">Customer: ${customerName}</div>
        <div class="address">${address || ''}</div>
        <div class="meta">Design No: ${designNo} | Date: ${formattedDate}</div>
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













export const generatePackingPDF = ({ rows, firmName, customerName, designNo, date }) => {
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
          .meta { text-align: center; font-size: 14px; margin-bottom: 20px; }

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
              ${items.map((item, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${item.itemName}</td>
                  <td>${item.taga}</td>
                  <td>${item.qty}</td>
                </tr>
              `).join("")}
              <tr>
                <td colspan="3"><strong>Total</strong></td>
                <td><strong>${totalQty}</strong></td>
              </tr>
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
        window.onload = () => setTimeout(() => {
          window.print();
          window.onafterprint = () => window.close();
        }, 500);
      </script>
    </html>
  `);

  popup.document.close();
};








// utils/generateCombinedPDF.js


export const generateCombinedPDF = ({ rows, firmName, customerName, designNo, date }) => {
  const grouped = groupByPackage(rows);
  const pkgNumbers = Object.keys(grouped);
  const popup = window.open("", "_blank");
  const formattedDate = new Date(date).toLocaleDateString();


  popup.document.write(`
    <html>
      <head>
        <title>Packing Slips</title>
        <style>
          body { font-family: sans-serif; margin: 20px; }
          .firm-name { text-align: center; font-weight: bold; font-size: 18px; margin-bottom: 8px; }
          .customer-name { text-align: center; margin-bottom: 20px; font-size: 14px; }

          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { border: 1px solid #ddd; padding: 6px; font-size: 14px; text-align: left; }
          th { background-color: #f0f0f0; }

          .page { display: flex; flex-wrap: wrap; justify-content: space-between; page-break-after: always; }
          .slip {
            width: 48%;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 20px;
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
          .meta { text-align: center; font-size: 14px; margin-bottom: 20px; }


          .info { font-size: 14px; margin-bottom: 4px; }
          .footer { margin-top: 10px; font-size: 12px; text-align: right; }

          .summary-page { page-break-after: always; }
        </style>
      </head>
      <body>
        <div class="firm-name">${firmName}</div>
        <div class="firm-details">
          10/214, Behind Radhakrishna Theatre,<br />
          ICHALKARANJI -416 115. ® (0230) 2436904
        </div>
        <div class="customer-name">Customer: ${customerName}</div>
        <div class="meta"> Date: ${formattedDate} | Design No: ${designNo} </div>


        <div class="summary-page">
  `);

  // Add summary section
  pkgNumbers.forEach(pkg => {
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

  popup.document.write(`</div>`); // Close summary

  // Add packing slips 6 per page
  for (let i = 0; i < pkgNumbers.length; i += 6) {
    popup.document.write(`<div class="page">`);
    const currentGroup = pkgNumbers.slice(i, i + 6);

    currentGroup.forEach(pkgNum => {
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
              ${items.map((item, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${item.itemName}</td>
                  <td>${item.taga}</td>
                  <td>${item.qty}</td>
                </tr>
              `).join("")}
              <tr>
                <td colspan="3"><strong>Total</strong></td>
                <td><strong>${totalQty}</strong></td>
              </tr>
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
        window.onload = () => setTimeout(() => {
          window.print();
          window.onafterprint = () => window.close();
        }, 500);
      </script>
    </html>
  `);

  popup.document.close();
};
