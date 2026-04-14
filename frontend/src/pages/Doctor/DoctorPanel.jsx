import { useState } from "react";
import DoctorDashboard from "./DoctorDashBoard";
import SearchPatient from "./SearchPatient";
import VisitNotes from "./VisitNotes";
import HelpPage from "../help";

function DoctorPanel() {
  const [active, setActive] = useState("dashboard");
  const username = localStorage.getItem("username");

  const navItems = [
    { key: "dashboard", label: "Dashboard",icon: "🏠" },
    { key: "patients",  label: "Search Patients", icon: "🔍" },
    { key: "visits",  label: "Add Visits",icon: "📝" },
    // { key: "profile",  label: "Profile", icon: "👨‍⚕️" },
     { key: "help",      label: "Help & Support",  icon: "🆘" },
  ];

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">🏥</div>
          <h2>Doctor Panel</h2>
          <span>Health Portal</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.key}
              className={active === item.key ? "active" : ""}
              onClick={() => setActive(item.key)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* <div className="sidebar-footer">
          <p>© 2025 HealthAdmin</p>
        </div> */}
      </div>

      <div className="content">
        <div className="topbar">
          <div className="user-box">
            <div className="user-icon">{username?.[0]?.toUpperCase()}</div>
            <div><div>{username}</div></div>
          </div>
        </div>

        {active === "dashboard" && <DoctorDashboard />}
        {active === "patients" && <SearchPatient />}
        {active === "visits"  && <VisitNotes />}
        {/* {active === "profile"  && <div className="page-content"><h2>Profile—Coming Soon</h2></div>} */}
        {active === "help" && <HelpPage />}
      </div>
    </div>
  );
}

export default DoctorPanel;