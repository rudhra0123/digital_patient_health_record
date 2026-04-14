import { useState } from "react";
import api from "../services/api";
import "../styles/UploadRecords.css";

function UploadRecords() {
  const [file, setFile] = useState(null);
  const [hospital, setHospital] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");


const handleUpload = async () => {
  if (!file || !hospital || !doctor || !date || !reason) {
    alert("Please fill all fields and select a PDF");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("patientUid", localStorage.getItem("patientUid"));
  formData.append("hospital", hospital);
  formData.append("doctor", doctor);
  formData.append("visitDate", date);
  formData.append("reason", reason);

  try {
    const res = await api.post("/records/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    alert("Record uploaded successfully");

    setFile(null);
    setHospital("");
    setDoctor("");
    setDate("");
    setReason("");

  } catch (error) {
    console.error(error);
    alert("Upload failed");
  }
};

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h2>Upload Medical Records</h2>

        <div className="upload-group">
          <label>Hospital Name</label>
          <input
            type="text"
            placeholder="Enter hospital name"
            value={hospital}
            onChange={(e) => setHospital(e.target.value)}
          />
        </div>

        <div className="upload-group">
          <label>Doctor Name</label>
          <input
            type="text"
            placeholder="Enter doctor name"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
          />
        </div>

        <div className="upload-group">
          <label>Date of Visit</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="upload-group">
          <label>Reason for Visit</label>
          <input
            type="text"
            placeholder="Enter reason for visit"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div className="upload-group">
          <label>Upload Report (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <button className="upload-button" onClick={handleUpload}>
          Upload Record
        </button>

        <p className="upload-note">
          📄 Only PDF files are supported
        </p>
      </div>
    </div>
  );
}

export default UploadRecords;
