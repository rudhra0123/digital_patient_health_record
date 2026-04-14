function Topbar() {
  const username = localStorage.getItem("username") || "User";
  const patientId = localStorage.getItem("patientUid") || "PAT-000000";

  return (
    <div className="topbar">
      <div className="user-info">
        <div className="user-icon">{username[0].toUpperCase()}</div>
        <div>
          <div>{username}</div>
          <small>{patientId}</small>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
