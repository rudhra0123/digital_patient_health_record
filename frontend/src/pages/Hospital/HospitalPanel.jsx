import { useState } from "react";
import "../../styles/admindashboard.css";
import HospitalDashboard from "./HospitalDashboard";
import AddRecords from "./AddRecords";
import HelpPage from "../help";

function HospitalPanel() {
  const [active, setActive] = useState("dashboard");
  const username = localStorage.getItem("username");
  const displayInitial = username && username.length ? username[0].toUpperCase() : "H";

  const navItems = [
    { key: "dashboard", label: "Dashboard",    icon: "🏠" },
    { key: "records",   label: "Add Records",  icon: "📁" },
    // { key: "patients",  label: "Search Patient", icon: "🔍" },
    // { key: "profile",   label: "Profile",      icon: "🏥" },
     { key: "help",      label: "Help & Support",  icon: "🆘" },
  ];

  return (
    <div className="dashboard">

      <div className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">🏥</div>
          <h2>Hospital Panel</h2>
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

        <div className="sidebar-footer">
          <p>© 2025 HealthAdmin</p>
        </div>
      </div>

      <div className="content">
        <div className="topbar">
          <div className="user-box">
            <div className="user-icon">{displayInitial}</div>
            <div><div>{username}</div></div>
          </div>
        </div>

        {active === "dashboard"&& <HospitalDashboard/>}
        {active === "records"  && <AddRecords />}
        {/* {active === "patients" && <div className="page-content"><h2>Search Patient — Coming Soon</h2></div>} */}
        {/* {active === "profile"  && <div className="page-content"><h2>Profile — Coming Soon</h2></div>} */}
        {active === "help" && <HelpPage />}
      </div>

    </div>
  );
}

export default HospitalPanel;