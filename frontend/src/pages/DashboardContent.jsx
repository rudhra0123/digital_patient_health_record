import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/patientdashboard.css";

function Dashboard({ patientId }) {
  const [recordsCount, setRecordsCount] = useState(0);
  const [lastVisit, setLastVisit] = useState(null);

  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const profileCompleted = false;

  // useEffect(() => {
  //   const fetchRecords = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       let uid = null;

  //       if (role === "doctor" && patientId) {

  //         const res = await axios.get(
  //           `http://localhost:5000/api/doctor/patient/${patientId}`,
  //           { headers: { Authorization: `Bearer ${token}` } }
  //         );
  //         uid = res.data.patient?.patientUid;
  //       } else {
 
  //         uid = localStorage.getItem("patientUid");
  //       }

  //       if (!uid) return;

  //       const res = await axios.get(
  //         `http://localhost:5000/api/records/history/${uid}`
  //       );

  //       if (res.data && res.data.length > 0) {
  //         setRecordsCount(res.data.length);
  //         const dates = res.data.map(r => new Date(r.visitDate));
  //         const mostRecentDate = new Date(Math.max(...dates));
  //         setLastVisit(mostRecentDate.toLocaleDateString());
  //       } else {
  //         setRecordsCount(0);
  //         setLastVisit(null);
  //       }

  //     } catch (error) {
  //       console.error("Error fetching records:", error);
  //     }
  //   };

  //   fetchRecords();
  // }, [patientId]);
   
  useEffect(() => {
  const fetchRecords = async () => {
    try {
      // ✅ patientId is already patientUid — use directly!
      const uid = patientId;

      if (!uid) return;

      const res = await axios.get(
        `http://localhost:5000/api/records/history/${uid}`
      );

      if (res.data && res.data.length > 0) {
        setRecordsCount(res.data.length);
        const dates = res.data.map(r => new Date(r.visitDate));
        const mostRecentDate = new Date(Math.max(...dates));
        setLastVisit(mostRecentDate.toLocaleDateString());
      } else {
        setRecordsCount(0);
        setLastVisit(null);
      }
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  if (patientId) fetchRecords();
}, [patientId]);
  return (
    <div className="dashboard-container">

      <div className="welcome-card">
        <h2>{role === "doctor" ? "Viewing Patient" : `Welcome, ${username}`}</h2>
        <p>Patient ID: {patientId}</p>
      </div>

      {role !== "doctor" && (!profileCompleted || recordsCount === 0) && (
        <div className="card-row">
          {!profileCompleted && (
            <ActionCard title="Complete Profile" desc="Add your personal and medical details" />
          )}
          {recordsCount === 0 && (
            <ActionCard title="Upload Medical Records" desc="Upload prescriptions, lab reports, scans" />
          )}
        </div>
      )}

      <div className="card-row">
        <StatusCard title="Records Uploaded" value={recordsCount} />
        <StatusCard title="Last Medical Visit" value={lastVisit || "—"} />
      </div>

      <div className="summary-card">
        <h3>Health Summary</h3>
        {recordsCount === 0 ? (
          <p>Once you upload your medical records, a summarized overview of your health history will be displayed here.</p>
        ) : (
          <p>Based on uploaded records, medical history is being analyzed. Detailed insights will be available soon.</p>
        )}
      </div>

    </div>
  );
}

function ActionCard({ title, desc }) {
  return <div className="action-card"><h4>{title}</h4><p>{desc}</p></div>;
}

function StatusCard({ title, value }) {
  return <div className="status-card"><h4>{title}</h4><p>{value}</p></div>;
}

export default Dashboard;