import { useState } from "react";
import axios from "axios";


function AddRecords() {
  const [patientUid, setPatientUid] = useState("");
  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [file, setFile] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const searchPatient = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/hospital/patient-visits/${patientUid}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPatient(res.data.patient);
      setVisits(res.data.visits);
      setSelectedVisit(null);
      setError("");
    } catch (err) {
      setPatient(null);
      setVisits([]);
      setError("Patient not found!");
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedVisit || !reason) {
      alert("Please select a visit, enter reason and upload a PDF!");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("patientUid", patient.patientUid);
      formData.append("visitId", selectedVisit._id);
      formData.append("reason", reason);

      await axios.post(
        "http://localhost:5000/api/hospital/upload-record",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setSuccess(true);
      setFile(null);
      setReason("");
      setSelectedVisit(null);
      setPatient(null);
      setVisits([]);
      setPatientUid("");
    } catch (err) {
      setError("Upload failed!");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">

      <div className="page-header">
        <h2>📁 Add Records</h2>
        <p>Search patient, select visit and upload report.</p>
      </div>

      {/* SUCCESS */}
      {success && (
        <div style={{
          background: "#e6faf3", border: "1.5px solid #00c48c",
          borderRadius: "10px", padding: "14px 20px",
          color: "#00874f", marginBottom: "24px", fontWeight: 600
        }}>
          ✅ Record uploaded successfully!
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
        {error && <p style={{ color: "#e74c6f", marginTop: "10px", fontSize: "13px" }}>{error}</p>}
      </div>

      {/* PATIENT INFO */}
      {patient && (
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
            </tbody>
          </table>
        </div>
      )}

      {/* VISITS LIST */}
      {visits.length > 0 && (
        <>
          <div className="section-title">🏥 Select a Visit</div>
          <div className="table-wrap" style={{ marginBottom: "24px" }}>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Diagnosis</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {visits.map(v => (
                  <tr
                    key={v._id}
                    style={{
                      background: selectedVisit?._id === v._id ? "#f0f5ff" : "",
                      cursor: "pointer"
                    }}
                  >
                    <td>{new Date(v.visitDate).toLocaleDateString()}</td>
                    <td>{v.doctor?.name || "—"}</td>
                    <td>{v.doctor?.specialization || "—"}</td>
                    <td>{v.diagnosis || "—"}</td>
                    <td>
                      <button
                        className={`btn ${selectedVisit?._id === v._id ? "btn-primary" : "btn-secondary"}`}
                        style={{ padding: "7px 16px", fontSize: "12px" }}
                        onClick={() => setSelectedVisit(v)}
                      >
                        {selectedVisit?._id === v._id ? "✓ Selected" : "Select"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* UPLOAD FORM */}
      {selectedVisit && (
        <div className="add-form">
          <h3>📤 Upload Report for {selectedVisit.doctor?.name} — {new Date(selectedVisit.visitDate).toLocaleDateString()}</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Reason / Report Type</label>
              <input
                type="text"
                placeholder="e.g. Blood Test, X-Ray, Scan"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Upload PDF Report</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          </div>
          <div className="form-actions">
            <button
              className="btn btn-primary"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? "Uploading..." : "📤 Upload Report"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedVisit(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default AddRecords;