import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admindashboard.css";

function DoctorDashboard() {
  const [data, setData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:5000/api/doctor/dashboard", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      // console.log("Doctor dashboard data:", res.data);
      setData(res.data);
    })
    .catch(err => console.log(err));
  }, []);

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Doctor Dashboard</h2>
        <p>Welcome Dr. {localStorage.getItem("username")} 👨‍⚕️</p>
      </div>

      <div className="cards">
        <div className="card">
          <div className="card-icon">🧑‍⚕️</div>
          <label>Patients Viewed</label>
          <h3>{data.patientsViewed ?? 0}</h3>
        </div>
        <div className="card">
          <div className="card-icon">📋</div>
          <label>Visits Added</label>
          <h3>{data.visits ?? 0}</h3>
        </div>
        <div className="card">
          <div className="card-icon">📅</div>
          <label>Patients Today</label>
          <h3>{data.todayPatients ?? 0}</h3>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;