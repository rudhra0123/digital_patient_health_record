import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../services/api";

function AdminDashboardContent() {

  const [data, setData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:5000/api/admin/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      // console.log(res.data);
      setData(res.data);
    })
    .catch(err => {
      // console.log(err);
    });

  }, []);

  return (
    <div>

      <h2>Dashboard</h2>

      <div className="cards">

        <div className="card">
          Patients
          <h3>{data.totalPatients}</h3>
        </div>

        <div className="card">
          Doctors
          <h3>{data.totalDoctors}</h3>
        </div>

        <div className="card">
          Hospitals
          <h3>{data.totalHospitals}</h3>
        </div>

      </div>

      <h3>Recent Patients</h3>

      <table border="1">
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Username</th>
            <th>Name</th>
          </tr>
        </thead>

        <tbody>
          {data.recentPatients?.map(p => (
            <tr key={p._id}>
              <td>{p.patientUid}</td>
              <td>{p.username}</td>
              <td>{p.fullName}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default AdminDashboardContent;