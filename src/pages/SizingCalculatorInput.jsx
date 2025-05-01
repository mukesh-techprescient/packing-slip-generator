import React, { useState } from "react";

const SizingCalculatorInput = () => {
  const [formData, setFormData] = useState({
    partyName: "",
    date: new Date().toISOString().substring(0, 10),
    sizingName: "",
    reedSpace: "",
    ends: "",
    totalEnds: "",
    lease: "",
    totalBeam: "",
    measure: "",
    quality: "",
    yarn: "",
    bags: "",
    cone: "",
    beamDetails: [
      {
        weaver: "",
        beam: "",
        meters: "",
        weight: "",
        cut: "",
      },
    ],
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBeamChange = (index, e) => {
    const { name, value } = e.target;
    const updatedBeams = [...formData.beamDetails];
    updatedBeams[index][name] = value;
    setFormData((prev) => ({ ...prev, beamDetails: updatedBeams }));
  };

  const addBeamRow = () => {
    setFormData((prev) => ({
      ...prev,
      beamDetails: [
        ...prev.beamDetails,
        { weaver: "", beam: "", meters: "", weight: "", cut: "" },
      ],
    }));
  };

  const removeBeamRow = (index) => {
    const updatedBeams = formData.beamDetails.filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, beamDetails: updatedBeams }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.partyName) newErrors.partyName = "Party Name is required.";
    if (!formData.sizingName) newErrors.sizingName = "Sizing Name is required.";
    if (!formData.reedSpace) newErrors.reedSpace = "Reed Space is required.";

    if (formData.beamDetails.some(beam => !beam.weaver || !beam.beam || !beam.meters || !beam.weight || !beam.cut)) {
      newErrors.beamDetails = "All beam details must be filled.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Form Data Submitted:", formData);
    } else {
      console.log("Form has errors.");
    }
  };

  return (
    <div className="form-container">
      <h2 className="header-title">Sizing Calculator Input</h2>
      <form onSubmit={handleSubmit}>
        <table className="form-table">
          <tbody>
            <tr>
              <td><label htmlFor="partyName">Party Name</label></td>
              <td>
                <input
                  id="partyName"
                  name="partyName"
                  placeholder="Party Name"
                  value={formData.partyName}
                  onChange={handleChange}
                  className="form-input"
                />
                {errors.partyName && <p className="error-message">{errors.partyName}</p>}
              </td>
            </tr>
            <tr>
              <td><label htmlFor="date">Date</label></td>
              <td>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="form-input"
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="sizingName">Sizing Name</label></td>
              <td>
                <input
                  id="sizingName"
                  name="sizingName"
                  placeholder="Sizing Name"
                  value={formData.sizingName}
                  onChange={handleChange}
                  className="form-input"
                />
                {errors.sizingName && <p className="error-message">{errors.sizingName}</p>}
              </td>
            </tr>
            <tr>
              <td><label htmlFor="reedSpace">Reed Space</label></td>
              <td>
                <input
                  id="reedSpace"
                  name="reedSpace"
                  placeholder="Reed Space"
                  value={formData.reedSpace}
                  onChange={handleChange}
                  className="form-input"
                />
                {errors.reedSpace && <p className="error-message">{errors.reedSpace}</p>}
              </td>
            </tr>
            <tr>
              <td><label htmlFor="ends">Ends</label></td>
              <td>
                <input
                  id="ends"
                  name="ends"
                  placeholder="Ends"
                  value={formData.ends}
                  onChange={handleChange}
                  className="form-input"
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="totalEnds">Total Ends</label></td>
              <td>
                <input
                  id="totalEnds"
                  name="totalEnds"
                  placeholder="Total Ends"
                  value={formData.totalEnds}
                  onChange={handleChange}
                  className="form-input"
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="lease">Lease</label></td>
              <td>
                <input
                  id="lease"
                  name="lease"
                  placeholder="Lease"
                  value={formData.lease}
                  onChange={handleChange}
                  className="form-input"
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="totalBeam">Total Beam</label></td>
              <td>
                <input
                  id="totalBeam"
                  name="totalBeam"
                  placeholder="Total Beam"
                  value={formData.totalBeam}
                  onChange={handleChange}
                  className="form-input"
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="measure">Measure (Meters)</label></td>
              <td>
                <input
                  id="measure"
                  name="measure"
                  placeholder="Measure"
                  value={formData.measure}
                  onChange={handleChange}
                  className="form-input"
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="quality">Quality</label></td>
              <td>
                <input
                  id="quality"
                  name="quality"
                  placeholder="Quality"
                  value={formData.quality}
                  onChange={handleChange}
                  className="form-input"
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="yarn">Yarn</label></td>
              <td>
                <input
                  id="yarn"
                  name="yarn"
                  placeholder="Yarn"
                  value={formData.yarn}
                  onChange={handleChange}
                  className="form-input"
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="bags">Bags</label></td>
              <td>
                <input
                  id="bags"
                  name="bags"
                  placeholder="Bags"
                  value={formData.bags}
                  onChange={handleChange}
                  className="form-input"
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="cone">Cone</label></td>
              <td>
                <input
                  id="cone"
                  name="cone"
                  placeholder="Cone"
                  value={formData.cone}
                  onChange={handleChange}
                  className="form-input"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <h3 className="section-title">Beam Details</h3>
        {formData.beamDetails.map((beam, idx) => (
          <table key={idx} className="form-table">
            <tbody>
              <tr>
                <td><input name="weaver" placeholder="Weaver" value={beam.weaver} onChange={(e) => handleBeamChange(idx, e)} className="form-input" /></td>
                <td><input name="beam" placeholder="Beam" value={beam.beam} onChange={(e) => handleBeamChange(idx, e)} className="form-input" /></td>
                <td><input name="meters" placeholder="Meters" value={beam.meters} onChange={(e) => handleBeamChange(idx, e)} className="form-input" /></td>
                <td><input name="weight" placeholder="Weight" value={beam.weight} onChange={(e) => handleBeamChange(idx, e)} className="form-input" /></td>
                <td><input name="cut" placeholder="Cut" value={beam.cut} onChange={(e) => handleBeamChange(idx, e)} className="form-input" /></td>
                <td><button type="button" onClick={() => removeBeamRow(idx)} className="remove-row-button">Remove</button></td>
              </tr>
            </tbody>
          </table>
        ))}
        <button type="button" onClick={addBeamRow} className="add-row-button">
          + Add Beam Row
        </button>

        <button type="submit" className="form-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SizingCalculatorInput;
