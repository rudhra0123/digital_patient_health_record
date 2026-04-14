import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../styles/layout.css";

function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
