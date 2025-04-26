function InputsSection({ date, setDate, wayBillNo, setWayBillNo, designNo, setDesignNo, setNo, setSetNo, customerName, setCustomerName, firmName, setFirmName }) {
    return (
      <div className="inputs-container compact-inputs">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} placeholder="Date" />
        <input value={wayBillNo} onChange={(e) => setWayBillNo(e.target.value)} placeholder="Waybill No." />
        <input value={designNo} onChange={(e) => setDesignNo(e.target.value)} placeholder="Design No." />
        <input value={setNo} onChange={(e) => setSetNo(e.target.value)} placeholder="Set No." />
        <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Customer Name" />
        <input value={firmName} onChange={(e) => setFirmName(e.target.value)} placeholder="Firm Name" />
      </div>
    );
  }
  
  export default InputsSection;
  