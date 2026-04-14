import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ViewProfile({ patientId }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const role = localStorage.getItem("role");

  useEffect(() => {
  console.log("patientId in ViewProfile:", patientId); // ✅
  console.log("role in ViewProfile:", role);
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (patientId && role === "doctor") {

          const res = await axios.get(
            `http://localhost:5000/api/patient/profile/${patientId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setProfile(res.data);
        } else {
 
          const res = await axios.get(
            "http://localhost:5000/api/patient/profile",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setProfile(res.data);
        }
      } catch (err) {
        setProfile(null);
      }
    };

    fetchProfile();
  }, [patientId]); 

  return (
    <div>
      <h2>My Profile</h2>
      <div style={{
        background: "white", padding: "30px", borderRadius: "10px",
        maxWidth: "600px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        <ProfileRow label="Username"         value={profile?.username} />
        <ProfileRow label="Patient ID"       value={profile?.patientUid} />
        <ProfileRow label="Age"              value={profile?.age} />
        <ProfileRow label="Blood Group"      value={profile?.bloodGroup} />
        <ProfileRow label="Email"            value={profile?.email} />
        <ProfileRow label="Phone"            value={profile?.phone} />
        <ProfileRow label="Alternate Phone"  value={profile?.alternatePhone} />
        <ProfileRow label="Gender"           value={profile?.gender} />
        <ProfileRow
          label="Registration Date"
          value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "--"}
        />
        <ProfileRow
          label="Profile Status"
          value={profile?.profileCompleted ? "✅ Completed" : "❌ Incomplete"}
        />

        {role !== "doctor" && (
          <button
            style={{
              marginTop: "20px", padding: "10px 20px",
              background: "#1976d2", color: "white",
              border: "none", borderRadius: "6px", cursor: "pointer"
            }}
            onClick={() => navigate("/edit-profile")}
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between",
      marginBottom: "12px", borderBottom: "1px solid #e3f2fd", paddingBottom: "6px"
    }}>
      <strong style={{ color: "#0d47a1" }}>{label}</strong>
      <span>{value || "--"}</span>
    </div>
  );
}

export default ViewProfile;