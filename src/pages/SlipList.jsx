import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listSlips, deleteSlip } from "../mockApi"; // 👈 import deleteSlip also

const SlipList = () => {
  const navigate = useNavigate();
  const [slips, setSlips] = useState([]);

  useEffect(() => {
    fetchSlips();
  }, []);

  const fetchSlips = async () => {
    const data = await listSlips();
    setSlips(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this slip?")) {
      await deleteSlip(id);
      fetchSlips(); // refresh list after delete
    }
  };

  return (
    <div className="container">
      <h2>Slip Listing</h2>
    {/* 👇 Create New Slip Button */}
    <button 
        onClick={() => navigate("/slips/new")} 
        style={{ marginBottom: "20px", padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px" }}
      >
        Create New Slip
      </button>

      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Firm Name</th>
            <th>Customer Name</th>
            <th>Design No</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {slips.length > 0 ? (
            slips.map((slip) => (
              <tr key={slip.id}>
                <td>{slip.id}</td>
                <td>{slip.firmName}</td>
                <td>{slip.customerName}</td>
                <td>{slip.designNo}</td>
                <td>{slip.date}</td>
                <td>
                  <button onClick={() => navigate(`/slips/${slip.id}`)}>View</button>{" "}
                  <button onClick={() => handleDelete(slip.id)} style={{ color: "red" }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" align="center">
                No slips found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SlipList;
