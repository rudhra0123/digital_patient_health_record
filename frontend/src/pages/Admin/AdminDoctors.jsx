import { useState, useEffect } from "react";
import axios from "axios";

function AdminDoctors() {

  const [query, setQuery] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [hospitalList, setHospitalList] = useState([]);
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    specialization: "",
    experience: "",
    hospital: ""
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
  const fetchHospitals = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "http://localhost:5000/api/admin/search-hospital?query=",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setHospitalList(res.data);
  };
  fetchHospitals();
}, []);

  const fetchDoctors = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:5000/api/admin/search-doctor?query=`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setDoctors(res.data);
  };

  const searchDoctor = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:5000/api/admin/search-doctor?query=${query}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setDoctors(res.data);
  };

  const deleteDoctor = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/admin/doctor/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setDoctors(doctors.filter(d => d._id !== id));
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addDoctor = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/doctor/add-doctor`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Doctor added successfully!");
      setShowForm(false);
      setForm({
        username: "",
        name: "",
        email: "",
        password: "",
        specialization: "",
        experience: "",
        hospital: ""
      });
      fetchDoctors();
    } catch (err) {
      alert("Error adding doctor!");
      console.log(err);
    }
  };

  return (
    <div>

      <h2>Doctors</h2>
      <input
        type="text"
        placeholder="Search doctor"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchDoctor}>Search</button>
      <button
        onClick={() => setShowForm(!showForm)}
        style={{ marginLeft: "10px" }}
      >
        {showForm ? "Cancel" : "Add Doctor"}
      </button>
      {showForm && (
        <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "20px" }}>
          <h3>Add New Doctor</h3>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleFormChange}
          /><br /><br />

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleFormChange}
          /><br /><br />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleFormChange}
          /><br /><br />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleFormChange}
          /><br /><br />

          <input
            type="text"
            name="specialization"
            placeholder="Specialization"
            value={form.specialization}
            onChange={handleFormChange}
          /><br /><br />

          <input
            type="number"
            name="experience"
            placeholder="Experience (years)"
            value={form.experience}
            onChange={handleFormChange}
          /><br /><br />

          <div className="form-group">
  <label>Hospital</label>
  <select
    name="hospital"
    value={form.hospital}
    onChange={handleFormChange}
    style={{
      padding: "8px 10px", border: "1.5px solid #dce6f5",
      borderRadius: "10px", fontFamily: "inherit",
      fontSize: "14px", outline: "none", background: "#f0f5ff",
      marginTop:"10px"
    }}
  >
    <option value="">Select Hospital</option>
    {hospitalList.map(h => (
      <option key={h._id} value={h._id}> 
        {h.name}
      </option>
    ))}
  </select>
</div>
          <br /><br />

          <button onClick={addDoctor}>Submit</button>
        </div>
      )}
      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Doctor ID</th>
            <th>Name</th>
            <th>Specialization</th>
            <th>Experience</th>
            <th>Hospital</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map(d => (
            <tr key={d._id}>
              <td>{d.doctorUid}</td>
              <td>{d.name}</td>
              <td>{d.specialization}</td>
              <td>{d.experience}</td>
              <td>{d.hospital?.name}</td>
              <td>
                <button onClick={() => deleteDoctor(d._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default AdminDoctors;