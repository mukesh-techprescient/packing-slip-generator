export const generateSummaryHTML = ({ grouped, firmName, customerName, designNo, date, address }) => {
    const formattedDate = new Date(date).toLocaleDateString();
    let html = `
      <div class="firm-details">
        <strong>${firmName.toUpperCase()}</strong>
        10/214, Behind Radhakrishna Theatre,<br />
        ICHALKARANJI -416 115. ® (0230) 2436904
      </div>
      <div class="customer-name">Customer: ${customerName}</div>
      <div class="address">${address || ''}</div>
      <div class="meta">Design No: ${designNo} | Date: ${formattedDate}</div>
    `;
  
    Object.keys(grouped).forEach(pkg => {
      html += `
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
      `;
    });
  
    return html;
  };
  
  export const generatePackingSlipsHTML = ({ grouped, firmName, customerName, designNo, date }) => {
    const pkgNumbers = Object.keys(grouped);
    let html = '';
  
    for (let i = 0; i < pkgNumbers.length; i += 6) {
      html += `<div class="page">`;
      const group = pkgNumbers.slice(i, i + 6);
  
      group.forEach((pkgNum) => {
        const items = grouped[pkgNum];
        const totalQty = items.reduce((sum, item) => sum + Number(item.qty), 0);
  
        html += `
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
            <div class="footer">Signature: _______________________</div>
          </div>
        `;
      });
  
      html += `</div>`;
    }
  
    return html;
  };
  