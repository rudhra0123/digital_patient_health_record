import { useEffect, useState } from "react";
import axios from "axios";

function HospitalDashboard(){
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/hospital/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="page-content">

      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Welcome, {localStorage.getItem("hospitalName") || "Hospital"} 🏥</p>
      </div>

      {/* STAT CARDS */}
      <div className="cards">
        <div className="card">
          <div className="card-icon">🧑‍⚕️</div>
          <label>Total Patients Visited</label>
          <h3>{data.totalPatients ?? 0}</h3>
        </div>
        <div className="card">
          <div className="card-icon">👨‍⚕️</div>
          <label>Total Doctors</label>
          <h3>{data.totalDoctors ?? 0}</h3>
        </div>
        <div className="card">
          <div className="card-icon">📊</div>
          <label>Avg Patients / Day</label>
          <h3>{data.avgPatients ?? 0}</h3>
        </div>
        <div className="card">
          <div className="card-icon">💊</div>
          <label>Treatment Types</label>
          <h3>{data.treatments?.length ?? 0}</h3>
        </div>
      </div>

      {/* TREATMENTS TABLE */}
      <div className="section-title">💊 Treatment Specializations</div>
      <div className="table-wrap" style={{ marginBottom: "28px" }}>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Specialization</th>
            </tr>
          </thead>
          <tbody>
            {data.treatments?.length ? (
              data.treatments.map((t, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{t}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">
                  <div className="empty-state">No treatments found.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* DOCTORS TABLE */}
      <div className="section-title">👨‍⚕️ Doctors in This Hospital</div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Doctor ID</th>
              <th>Name</th>
              <th>Specialization</th>
              <th>Experience</th>
            </tr>
          </thead>
          <tbody>
            {data.doctors?.length ? (
              data.doctors.map(d => (
                <tr key={d._id}>
                  <td><span className="uid-badge">{d.doctorUid}</span></td>
                  <td>{d.name}</td>
                  <td>{d.specialization || "—"}</td>
                  <td>{d.experience ? `${d.experience} yrs` : "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">
                  <div className="empty-state">No doctors found.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default HospitalDashboard;