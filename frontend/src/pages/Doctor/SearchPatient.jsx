// import {useState} from "react";
// import axios from "axios";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// function SearchPatient(){
//     const navigate = useNavigate();

// const [query,setQuery] = useState("");
// const [patients,setPatients] = useState([]);
//   useEffect(() => {
//     fetchPatients();
//   }, []);

//  const fetchPatients = async () => {
//     const token = localStorage.getItem("token");
//     const res = await axios.get(`http://localhost:5000/api/admin/search-patient?query=`, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     setPatients(res.data);
//   };

// const searchPatient = async ()=>{

// const token = localStorage.getItem("token");

// const res = await axios.get(
// `http://localhost:5000/api/admin/search-patient?query=${query}`,
// {
// headers:{
// Authorization:`Bearer ${token}`
// }
// }
// );

// setPatients(res.data);

// };

// return(

// <div>

// <h2>Search Patient</h2>

// <input
// type="text"
// placeholder="Search patient"
// value={query}
// onChange={(e)=>setQuery(e.target.value)}
// />

// <button onClick={searchPatient}>
// Search
// </button>

// <table>

// <thead>

// <tr>
// <th>UserName</th>
// <th>ID</th>
// <th>Name</th>
// <th>Age</th>
// <th>Action</th>
// </tr>

// </thead>

// <tbody>

// {patients.map(p=>(
// <tr key={p._id}>
// <td>{p.username}</td>
// <td>{p.patientUid}</td>
// <td>{p.fullName}</td>
// <td>{p.age}</td>

// <td>

// <button onClick={() => navigate(`/patient-view/${p._id}`)}>
// View
// </button>

// </td>

// </tr>
// ))}

// </tbody>

// </table>

// </div>

// );

// }

// export default SearchPatient;




import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SearchPatient() {
  const [activeTab, setActiveTab] = useState("id"); // "id" or "face"

  // ID Search
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState([]);

  // Face Search
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [faceLoading, setFaceLoading] = useState(false);
  const [faceResult, setFaceResult] = useState(null);
  const [faceError, setFaceError] = useState("");

  const navigate = useNavigate();

  const searchPatient = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:5000/api/admin/search-patient?query=${query}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPatients(res.data);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setPreview(reader.result);
      setFaceResult(null);
      setFaceError("");
    };
    reader.readAsDataURL(file);
  };

  const searchByFace = async () => {
    if (!image) {
      alert("their is image like this");
      return;
    }

    try {
      setFaceLoading(true);
      setFaceError("");
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/ml/search-face",
        { image },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status === "MATCH_FOUND") {
        setFaceResult(res.data);
      } else {
        setFaceError("No matching patient found!");
      }
    } catch (err) {
      setFaceError("Search failed! Try again.");
    } finally {
      setFaceLoading(false);
    }
  };

  return (
    <div className="page-content">

      <div className="page-header">
        <h2>Search Patient</h2>
        <p>Search by Patient ID or Face Recognition.</p>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
        <button
          className={`btn ${activeTab === "id" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setActiveTab("id")}
        >
          🔍 Search by ID
        </button>
        <button
          className={`btn ${activeTab === "face" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setActiveTab("face")}
        >
          📷 Search by Face
        </button>
      </div>

      {activeTab === "id" && (
        <>
          <div className="search-bar">
            <input
              type="text"
              placeholder="🔍  Search by name or patient ID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchPatient()}
            />
            <button className="btn btn-primary" onClick={searchPatient}>Search</button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Age</th>
                  <th>Blood Group</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {patients.length ? (
                  patients.map(p => (
                    <tr key={p._id}>
                      <td><span className="uid-badge">{p.patientUid}</span></td>
                      <td>{p.username}</td>
                      <td>{p.fullName || "—"}</td>
                      <td>{p.age || "—"}</td>
                      <td>{p.bloodGroup || "—"}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          style={{ padding: "7px 16px", fontSize: "12px" }}
                          onClick={() => navigate(`/patient-view/${p.patientUid}`)}
                        >
                          👁 View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">Search for a patient above.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "face" && (
        <div className="add-form">
          <h3>📷 Upload Patient Photo</h3>
          <p style={{ fontSize: "13px", color: "#6b7fa3", marginBottom: "20px" }}>
            Upload a photo of the patient to find their profile using face recognition.
          </p>

          <div style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap", marginBottom: "20px" }}>

            {preview ? (
              <img
                src={preview}
                alt="preview"
                style={{
                  width: "150px", height: "150px",
                  objectFit: "cover", borderRadius: "12px",
                  border: "2px solid #1a6fd4"
                }}
              />
            ) : (
              <div style={{
                width: "150px", height: "150px",
                borderRadius: "12px", border: "2px dashed #dce6f5",
                display: "flex", alignItems: "center",
                justifyContent: "center", background: "#f0f5ff",
                color: "#b0bdd6", fontSize: "48px"
              }}>
                👤
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input
                type="file"
                accept="image/*"
                id="face-search"
                style={{ display: "none" }}
                onChange={handlePhotoChange}
              />
              <label htmlFor="face-search" className="btn btn-secondary" style={{ cursor: "pointer" }}>
                📁 Choose Photo
              </label>
              <button
                className="btn btn-primary"
                onClick={searchByFace}
                disabled={faceLoading || !image}
              >
                {faceLoading ? "Searching..." : "🔍 Search by Face"}
              </button>
            </div>
          </div>

          {faceError && (
            <p style={{ color: "#e74c6f", fontWeight: 600, marginBottom: "16px" }}>❌ {faceError}</p>
          )}


          {faceResult && (
            <div style={{
              background: "#e6faf3", border: "1.5px solid #00c48c",
              borderRadius: "12px", padding: "20px", marginTop: "16px"
            }}>
              <h3 style={{ color: "#00874f", marginBottom: "16px" }}>
                ✅ Patient Found! ({faceResult.confidence}% match)
              </h3>

              <div className="table-wrap" style={{ marginBottom: "16px" }}>
                <table>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 700, color: "#6b7fa3", width: "160px" }}>Patient ID</td>
                      <td><span className="uid-badge">{faceResult.patient.patientUid}</span></td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700, color: "#6b7fa3" }}>Full Name</td>
                      <td>{faceResult.patient.fullName || "—"}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700, color: "#6b7fa3" }}>Age</td>
                      <td>{faceResult.patient.age || "—"}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700, color: "#6b7fa3" }}>Blood Group</td>
                      <td>{faceResult.patient.bloodGroup || "—"}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700, color: "#6b7fa3" }}>Gender</td>
                      <td>{faceResult.patient.gender || "—"}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700, color: "#6b7fa3" }}>Phone</td>
                      <td>{faceResult.patient.phone || "—"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => navigate(`/patient-view/${faceResult.patient.patientUid}`)}
                >
                👁 View Full Profile
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default SearchPatient;