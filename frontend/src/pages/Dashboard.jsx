// import { useState } from "react";
// import { useParams } from "react-router-dom";
// import "../styles/layout.css";
// import UploadRecords from "./UploadRecords";
// import ViewProfile from "./ViewProfile";
// import DashboardContent from "./DashboardContent";
// import History from "./History";
// import HelpPage from "./help";

// function Dashboard() {
//   const [active, setActive] = useState("dashboard");
//   const { id } = useParams();

//   const role = localStorage.getItem("role");
//   const username = localStorage.getItem("username");
//   const localPatientId = localStorage.getItem("patientUid");
//   const patientId = id || localPatientId;

//   const displayInitial = username && username.length ? username[0].toUpperCase() : "U";

// console.log("patientId:", patientId); 
// console.log("role:", role);
//   return (
//     <div className="dashboard">
//       <div className="sidebar">
//         <h2>Patient Panel</h2>
//         <button onClick={() => setActive("dashboard")}>Dashboard</button>
//         <button onClick={() => setActive("history")}>View History</button>
//         {role !== "doctor" && (
//           <button onClick={() => setActive("upload")}>Upload Records</button>
//         )}
//         <button onClick={() => setActive("view")}>View Profile</button>
//         <button onClick={() => setActive("help")}>Help & Support</button>
//       </div>

//       <div className="content">
//         <div className="topbar">
//           <div className="user-box">
//             <div className="user-icon">{displayInitial}</div>
//             <div><div>{username}</div></div>
//           </div>
//         </div>

//         {active === "dashboard"&& <DashboardContent patientId={patientId} />}
//         {active === "history"&& <History patientUid={patientId} />}
//         {active === "upload"&& <UploadRecords />}
//         {active === "view"&& <ViewProfile patientId={patientId} />}
//         {active === "help" && <HelpPage />}
//       </div>
//     </div>
//   );
// }

// export default Dashboard;



import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/layout.css";
import UploadRecords from "./UploadRecords";
import ViewProfile from "./ViewProfile";
import DashboardContent from "./DashboardContent";
import History from "./History";
import HelpPage from "./help";

function Dashboard() {
  const [active, setActive] = useState("dashboard");
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const { id } = useParams();
  const dropdownRef = useRef(null);

  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const localPatientId = localStorage.getItem("patientUid");
  const patientId = id || localPatientId;
  const displayInitial = username?.length ? username[0].toUpperCase() : "U";

  // ✅ Fetch notifications only for patients
  useEffect(() => {
    if (role !== "patient") return;
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/patient/notifications",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotifications(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleBellClick = async () => {
    setShowNotif(!showNotif);
    if (!showNotif && unreadCount > 0) {
      try {
        const token = localStorage.getItem("token");
        await axios.put("http://localhost:5000/api/patient/notifications/read",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Patient Panel</h2>
        <button onClick={() => setActive("dashboard")}>Dashboard</button>
        <button onClick={() => setActive("history")}>View History</button>
        {role !== "doctor" && (
          <button onClick={() => setActive("upload")}>Upload Records</button>
        )}
        <button onClick={() => setActive("view")}>View Profile</button>
        <button onClick={() => setActive("help")}>Help & Support</button>
      </div>

      <div className="content">
        <div className="topbar">
          <div className="user-box">
            <div className="user-icon">{displayInitial}</div>
            <div><div>{username}</div></div>
          </div>

          {/* ✅ Bell icon - only for patients */}
          {role === "patient" && (
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <div onClick={handleBellClick} style={{
                cursor: "pointer", fontSize: "22px",
                position: "relative", marginRight: "16px"
              }}>
                🔔
                {unreadCount > 0 && (
                  <span style={{
                    position: "absolute", top: "-6px", right: "-8px",
                    background: "red", color: "#fff",
                    borderRadius: "50%", fontSize: "11px",
                    width: "18px", height: "18px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700
                  }}>
                    {unreadCount}
                  </span>
                )}
              </div>

              {/* ✅ Dropdown */}
              {showNotif && (
                <div style={{
                  position: "absolute", top: "36px", right: 0,
                  width: "320px", background: "#fff",
                  borderRadius: "14px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                  zIndex: 999, border: "1px solid #dce6f5", overflow: "hidden"
                }}>
                  <div style={{
                    padding: "14px 18px", fontWeight: 700,
                    color: "#0d1b3e", borderBottom: "1px solid #dce6f5",
                    fontSize: "15px"
                  }}>
                    🔔 Notifications
                  </div>

                  {notifications.length === 0 ? (
                    <div style={{ padding: "20px", textAlign: "center", color: "#6b7fa3" }}>
                      No notifications yet
                    </div>
                  ) : (
                    <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                      {notifications.map((n, i) => (
                        <div key={i} style={{
                          padding: "12px 18px",
                          background: n.isRead ? "#fff" : "#f0f5ff",
                          borderBottom: "1px solid #f0f4fa",
                          fontSize: "13px"
                        }}>
                          <p style={{ color: "#0d1b3e", fontWeight: 600, margin: 0 }}>
                            {n.message}
                          </p>
                          <p style={{ color: "#6b7fa3", margin: "4px 0 0", fontSize: "11px" }}>
                            {new Date(n.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {active === "dashboard" && <DashboardContent patientId={patientId} />}
        {active === "history" && <History patientUid={patientId} />}
        {active === "upload" && <UploadRecords />}
        {active === "view" && <ViewProfile patientId={patientId} />}
        {active === "help" && <HelpPage />}
      </div>
    </div>
  );
}

export default Dashboard;