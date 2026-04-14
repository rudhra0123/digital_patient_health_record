import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h2>Patient Panel</h2>
      <ul>
        <li onClick={() => navigate("/dashboard")}>Dashboard</li>
        {/* <li onClick={() => navigate("/edit-profile")}>Edit Profile</li> */}
        <li onClick={() => navigate("/upload-records")}>Upload Records</li>
        <li onClick={() => navigate("/view-profile")}>View Profile</li>
      </ul>
    </div>
  );
}

export default Sidebar;
