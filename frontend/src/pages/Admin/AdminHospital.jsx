import { useState, useEffect } from "react";
import axios from "axios";


function AdminHospitals() {

  const [query, setQuery] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    username: "",
    name: "",
    location: "",
    contact: "",
    password: "",
    email:""
  });

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:5000/api/admin/search-hospital?query=`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setHospitals(res.data);
  };

  const searchHospital = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:5000/api/admin/search-hospital?query=${query}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setHospitals(res.data);
  };

  const deleteHospital = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/admin/hospital/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setHospitals(hospitals.filter(h => h._id !== id));
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const addHospital = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`http://localhost:5000/api/hospital/add-hospital`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response.data); 
      alert("Hospital added successfully!");
      setShowForm(false);
      setForm({
        username: "",
        name: "",
        location: "",
        contact: "",
        password: ""
      });
      fetchHospitals();
    } catch (err) {
      console.log("Error:", err.response?.data?.message || err.message); 
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>

      <h2>Hospitals</h2>

      <input
        type="text"
        placeholder="Search hospital"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchHospital}>Search</button>

     
      <button
        onClick={() => setShowForm(!showForm)}
        style={{ marginLeft: "10px" }}
      >
        {showForm ? "Cancel" : "Add Hospital"}
      </button>

      {showForm && (
        <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "20px" }}>
          <h3>Add New Hospital</h3>

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
            placeholder="Hospital Name"
            value={form.name}
            onChange={handleFormChange}
          /><br /><br />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleFormChange}
          /><br /><br />

          <input
            type="text"
            name="contact"
            placeholder="Contact"
            value={form.contact}
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
    type="email"
    name="email"
    placeholder="hospital@email.com"
    value={form.email}
    onChange={handleFormChange}
  />


          <button onClick={addHospital}>Submit</button>
        </div>
      )}

      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Hospital ID</th>
            <th>Name</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {hospitals.map(h => (
            <tr key={h._id}>
              <td>{h.hospitalUid}</td>
              <td>{h.name}</td>
              <td>{h.location}</td>
              <td>
                <button onClick={() => deleteHospital(h._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default AdminHospitals;