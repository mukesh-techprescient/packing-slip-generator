function FooterActions({ 
  totalTaga, 
  totalQty, 
  addRow, 
  additem, 
  handleGeneratePackingPDF, 
  handleGenerateSummaryPDF, 
  handleGenerateCombinedPDF, 
  handleRenumber,
  handleSaveSlip 
}) {
  
  const handleSaveAndPrintSlip = async () => {
    await handleSaveSlip();
    handleGeneratePackingPDF();
  };

  const handleSaveAndPrintSummary = async () => {
    await handleSaveSlip();
    handleGenerateSummaryPDF();
  };

  const handleSaveAndPrintBoth = async () => {
    await handleSaveSlip();
    handleGenerateCombinedPDF();
  };

  return (
    <div>
      <div className="slip-summary">
        Summary - <strong>Total Taga:</strong> {totalTaga} | <strong>Total Mtrs:</strong> {totalQty.toFixed(2)}
      </div>

      <div className="button-bar">
        <button className="add" onClick={addRow}>➕ New Package</button>
        <button className="add" onClick={additem}>➕ Add item</button>
        <button className="generate" onClick={handleSaveAndPrintSlip}>📄 Print Slip</button>
        <button className="summary" onClick={handleSaveAndPrintSummary}>📊 Print Summary</button>
        <button className="combined" onClick={handleSaveAndPrintBoth}>🧾 Print Both</button>
        <button className="renumber" onClick={handleRenumber}>🔢 Renumber</button>
        <button className="save" onClick={handleSaveSlip}>💾 Save Slip</button>
      </div>
    </div>
  );
}

export default FooterActions;
