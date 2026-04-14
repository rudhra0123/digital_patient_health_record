// import { useState, useEffect } from "react";
// import api from "../services/api";
// import "../styles/EditProfile.css";
// import axios from "axios";

// function EditProfile() {

//   const [fullName, setFullName] = useState("");
//   const [age, setAge] = useState("");
//   const [bloodGroup, setBloodGroup] = useState("");
//   const [email, setEmail] = useState("");
//   const [gender, setGender] = useState("");
//   const [alternatePhone, setAlternatePhone] = useState("");
//   const [phone, setPhone] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api
//       .get("/patient/profile")
//       .then((res) => {
//         const profile = res.data;
//         setFullName(profile.fullName || "");
//         setAge(profile.age || "");
//         setBloodGroup(profile.bloodGroup || "");
//         setEmail(profile.email || "");
//         setGender(profile.gender || "");
//         setPhone(profile.phone || "");
//         setAlternatePhone(profile.alternatePhone || "");
//         setLoading(false);
//       })
//       .catch(() => {
//         setLoading(false);
//       });
//   }, []);
  

// const saveProfile = async () => {

//   try {

//     const token = localStorage.getItem("token");

//     await axios.put(
//       "http://localhost:5000/api/patient/update-profile",
//       {
//         fullName,
//         age,
//         bloodGroup,
//         email,
//         gender,
//         alternatePhone,
//         phone
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       }
//     );

//     alert("Profile updated successfully");

//   } catch (err) {
//     console.log(err);
//     alert("Error updating profile");
//   }

// };

//   if (loading) {
//     return <div>Loading...</div>; 
//   }

//   return (
//     <div className="profile-container">
//       <div className="profile-card">
//         <h2>Edit Profile</h2>

//         <div className="profile-grid">
//           <input
//             placeholder="Full Name"
//             onChange={(e) => setFullName(e.target.value)}
//           />

//           <input
//             type="number"
//             placeholder="Age"
//             onChange={(e) => setAge(e.target.value)}
//           />

//           <input
//             placeholder="Blood Group"
//             onChange={(e) => setBloodGroup(e.target.value)}
//           />

//           <input
//             placeholder="Email"
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           <select onChange={(e) => setGender(e.target.value)}>
//             <option value="">Select Gender</option>
//             <option value="Male">Male</option>
//             <option value="Female">Female</option>
//             <option value="Other">Other</option>
//           </select>

//           <input
//             placeholder="Phone Number"
//             onChange={(e) => setPhone(e.target.value)}
//           />

//           <input
//             placeholder="Alternate Phone Number"
//             onChange={(e) => setAlternatePhone(e.target.value)}
//           />
//         </div>

//         <button className="profile-button" onClick={saveProfile}>
//           Save Profile
//         </button>

//         <p className="profile-note">
//           📷 Profile photo upload will be enabled soon
//         </p>
//       </div>
//     </div>
//   );
// }

// export default EditProfile;


import { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/EditProfile.css";
import axios from "axios";

function EditProfile() {

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ face photos
  const [photos, setPhotos] = useState([null, null, null]);
  const [previews, setPreviews] = useState([null, null, null]);
  const [faceLoading, setFaceLoading] = useState(false);
  const [faceSuccess, setFaceSuccess] = useState(false);

  useEffect(() => {
    api
      .get("/patient/profile")
      .then((res) => {
        const profile = res.data;
        setFullName(profile.fullName || "");
        setAge(profile.age || "");
        setBloodGroup(profile.bloodGroup || "");
        setEmail(profile.email || "");
        setGender(profile.gender || "");
        setPhone(profile.phone || "");
        setAlternatePhone(profile.alternatePhone || "");
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

 const saveProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log("Token:", token); // ✅ check if token exists
    console.log("Sending update..."); // ✅ check if function runs

    await axios.put(
      "http://localhost:5000/api/patient/update-profile",
      { fullName, age, bloodGroup, email, gender, alternatePhone, phone },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Profile updated successfully");
  } catch (err) {
    console.log("Error:", err.response?.data); // ✅ check error details
    alert("Error updating profile");
  }
};
  // ✅ handle photo selection
  const handlePhotoChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPhotos = [...photos];
      const newPreviews = [...previews];
      newPhotos[index] = reader.result; // base64
      newPreviews[index] = reader.result;
      setPhotos(newPhotos);
      setPreviews(newPreviews);
    };
    reader.readAsDataURL(file);
  };

  // ✅ register face
  const registerFace = async () => {
    if (photos.some(p => p === null)) {
      alert("Please upload all 3 photos!");
      return;
    }

    try {
      setFaceLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/ml/register-face",
        { images: photos },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFaceSuccess(true);
      alert("Face registered successfully! 🎉");
    } catch (err) {
      console.log(err);
      alert("Face registration failed!");
    } finally {
      setFaceLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Edit Profile</h2>

        <div className="profile-grid">
          <input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
          <input placeholder="Blood Group" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} />
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input placeholder="Alternate Phone Number" value={alternatePhone} onChange={(e) => setAlternatePhone(e.target.value)} />
        </div>

        <button className="profile-button" onClick={saveProfile}>
          Save Profile
        </button>

        <div style={{
          marginTop: "32px", padding: "24px",
          border: "1.5px solid #dce6f5", borderRadius: "16px",
          background: "#f0f5ff"
        }}>
          <h3 style={{ marginBottom: "8px", color: "#0d1b3e" }}>
            📷 Register Face for Emergency Search
          </h3>
          <p style={{ fontSize: "13px", color: "#6b7fa3", marginBottom: "20px" }}>
            Upload 3 photos — Front, Left side, Right side of your face.
            This helps doctors find you in emergency situations!
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "20px" }}>
            {["Front", "Left Side", "Right Side"].map((label, index) => (
              <div key={index} style={{ textAlign: "center" }}>
                <p style={{ fontSize: "12px", fontWeight: 700, color: "#6b7fa3", marginBottom: "8px" }}>
                  {label}
                </p>

                {/* Preview */}
                {previews[index] ? (
                  <img
                    src={previews[index]}
                    alt={label}
                    style={{
                      width: "100px", height: "100px",
                      objectFit: "cover", borderRadius: "10px",
                      border: "2px solid #1a6fd4",
                      marginBottom: "8px", display: "block"
                    }}
                  />
                ) : (
                  <div style={{
                    width: "100px", height: "100px",
                    borderRadius: "10px", border: "2px dashed #dce6f5",
                    display: "flex", alignItems: "center",
                    justifyContent: "center", marginBottom: "8px",
                    background: "#fff", color: "#b0bdd6", fontSize: "28px"
                  }}>
                    👤
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id={`photo-${index}`}
                  onChange={(e) => handlePhotoChange(index, e)}
                />
                <label
                  htmlFor={`photo-${index}`}
                  style={{
                    padding: "6px 14px", background: "#1a6fd4",
                    color: "#fff", borderRadius: "20px",
                    fontSize: "12px", cursor: "pointer",
                    fontWeight: 600
                  }}
                >
                  {previews[index] ? "Change" : "Upload"}
                </label>
              </div>
            ))}
          </div>

          {faceSuccess && (
            <div style={{
              background: "#e6faf3", border: "1px solid #00c48c",
              borderRadius: "10px", padding: "10px 16px",
              color: "#00874f", fontSize: "13px",
              fontWeight: 600, marginBottom: "16px"
            }}>
              ✅ Face registered successfully!
            </div>
          )}

          <button
            onClick={registerFace}
            disabled={faceLoading}
            style={{
              padding: "11px 24px", background: "linear-gradient(135deg, #1a6fd4, #3b8fe8)",
              color: "#fff", border: "none", borderRadius: "50px",
              fontWeight: 600, fontSize: "14px", cursor: "pointer"
            }}
          >
            {faceLoading ? "Registering..." : "🔐 Register Face"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default EditProfile;