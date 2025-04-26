function PackingTable({ rows, updateRow, removeRow, addSubItem, handleEnterInQty, qtyRefs }) {
    const groupedRows = rows.reduce((acc, row, i) => {
      const key = row.packageNumber;
      if (!acc[key]) acc[key] = [];
      acc[key].push({ ...row, index: i });
      return acc;
    }, {});
  
    return (
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
            {Object.entries(groupedRows).flatMap(([pkg, groupRows]) =>
              groupRows.map((row, idx) => (
                <tr key={row.index}>
                  {idx === 0 && (
                    <td rowSpan={groupRows.length}>
                      <input value={row.packageNumber} onChange={(e) => updateRow(row.index, "packageNumber", e.target.value)} />
                    </td>
                  )}
                  <td>
                    <input value={row.itemName} onChange={(e) => updateRow(row.index, "itemName", e.target.value)} />
                  </td>
                  <td>
                    <input type="number" min={1} value={row.taga} onChange={(e) => updateRow(row.index, "taga", e.target.value)} />
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
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }
  
  export default PackingTable;
  