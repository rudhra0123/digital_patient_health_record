import { useState } from "react";
import axios from "axios";

function VisitNotes() {
  const [patientUid, setPatientUid] = useState("");
  const [patient, setPatient] = useState(null);
  const [form, setForm] = useState({
    diagnosis: "",
    prescription: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const searchPatient = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:5000/api/admin/search-patient?query=${patientUid}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data && res.data.length > 0) {
      setPatient(res.data[0]); // ✅ get first result
      setError("");
    } else {
      setPatient(null);
      setError("Patient not found!");
    }
  } catch (err) {
    setPatient(null);
    setError("Patient not found!");
  }
};

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/doctor/add-visit",
        { patientUid, ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setForm({ diagnosis: "", prescription: "", notes: "" });
      setPatient(null);
      setPatientUid("");
    } catch (err) {
      setError("Failed to add visit!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">

      <div className="page-header">
        <h2>📝 Add Visit Notes</h2>
        <p>Search patient and add diagnosis, prescription and notes.</p>
      </div>

      {/* SUCCESS MESSAGE */}
      {success && (
        <div style={{
          background: "#e6faf3", border: "1.5px solid #00c48c",
          borderRadius: "10px", padding: "14px 20px",
          color: "#00874f", marginBottom: "24px", fontWeight: 600
        }}>
          ✅ Visit notes added successfully!
          <button
            style={{ marginLeft: "16px", background: "none", border: "none", cursor: "pointer", color: "#00874f" }}
            onClick={() => setSuccess(false)}
          >✕</button>
        </div>
      )}

      {/* SEARCH PATIENT */}
      <div className="add-form">
        <h3>🔍 Search Patient</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Enter Patient ID (e.g. PAT1001)"
            value={patientUid}
            onChange={(e) => setPatientUid(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchPatient()}
            style={{
              flex: 1, padding: "11px 14px",
              border: "1.5px solid #dce6f5", borderRadius: "10px",
              fontFamily: "inherit", fontSize: "14px", outline: "none"
            }}
          />
          <button className="btn btn-primary" onClick={searchPatient}>Search</button>
        </div>

        {error && (
          <p style={{ color: "#e74c6f", marginTop: "10px", fontSize: "13px" }}>{error}</p>
        )}
      </div>

      {/* PATIENT INFO */}
      {patient && (
        <>
          <div className="table-wrap" style={{ marginBottom: "24px" }}>
            <table>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 700, color: "#6b7fa3", width: "180px" }}>Patient ID</td>
                  <td><span className="uid-badge">{patient.patientUid}</span></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700, color: "#6b7fa3" }}>Full Name</td>
                  <td>{patient.fullName || "—"}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700, color: "#6b7fa3" }}>Age</td>
                  <td>{patient.age || "—"}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700, color: "#6b7fa3" }}>Blood Group</td>
                  <td>{patient.bloodGroup || "—"}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700, color: "#6b7fa3" }}>Gender</td>
                  <td>{patient.gender || "—"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* VISIT NOTES FORM */}
          <div className="add-form">
            <h3>📋 Visit Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Diagnosis</label>
                <input
                  type="text"
                  placeholder="e.g. High fever, BP high"
                  value={form.diagnosis}
                  onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Prescription</label>
                <input
                  type="text"
                  placeholder="e.g. Paracetamol 500mg"
                  value={form.prescription}
                  onChange={(e) => setForm({ ...form, prescription: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: "20px" }}>
              <label>Additional Notes</label>
              <textarea
                placeholder="Any additional notes..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={4}
                style={{
                  padding: "11px 14px", border: "1.5px solid #dce6f5",
                  borderRadius: "10px", fontFamily: "inherit", fontSize: "14px",
                  outline: "none", width: "100%", resize: "vertical",
                  background: "#f0f5ff"
                }}
              />
            </div>
            <div className="form-actions">
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Saving..." : "✓ Save Visit Notes"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => { setPatient(null); setPatientUid(""); setForm({ diagnosis: "", prescription: "", notes: "" }); }}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

export default VisitNotes;