import { useState, useEffect } from "react";
import axios from "axios";

function AdminPatients() {

  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:5000/api/admin/search-patient?query=`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setPatients(res.data);
  };

  const searchPatient = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:5000/api/admin/search-patient?query=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setPatients(res.data);
  };

  return (
    <div>

      <h2>Patients</h2>

      <input
        type="text"
        placeholder="Search by username or patient ID"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={searchPatient}>
        Search
      </button>

      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>

        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Username</th>
            <th>Full Name</th>
            <th>Age</th>
            <th>Blood Group</th>
          </tr>
        </thead>

        <tbody>
          {patients.map(p => (
            <tr key={p._id}>
              <td>{p.patientUid}</td>
              <td>{p.username}</td>
              <td>{p.fullName}</td>
              <td>{p.age}</td>
              <td>{p.bloodGroup}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default AdminPatients;