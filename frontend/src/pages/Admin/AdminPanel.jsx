import { useState } from "react";
import "../../styles/admindashboard.css";

import AdminDashboardContent from "./AdminDashboard";
import AdminPatients from "./AdminPatients";
import AdminDoctors from "./AdminDoctors";
import AdminHospitals from "./AdminHospital";

function AdminPanel() {

const [active,setActive] = useState("dashboard");

const username = localStorage.getItem("username");
const displayInitial =
username && username.length ? username[0].toUpperCase() : "A";

return (

<div className="dashboard">


<div className="sidebar">

<h2>Admin Panel</h2>

<button
className={active==="dashboard"?"active":""}
onClick={()=>setActive("dashboard")}
>
Dashboard
</button>
<button
className={active==="patients"?"active":""}
onClick={()=>setActive("patients")}
>
Patients
</button>
<button
className={active==="doctors"?"active":""}
onClick={()=>setActive("doctors")}
>
Doctors
</button>
<button
className={active==="hospitals"?"active":""}
onClick={()=>setActive("hospitals")}
>
Hospitals
</button>

</div>


<div className="content">



<div className="topbar">

<div className="user-box">

<div className="user-icon">
{displayInitial}
</div>

<div>
<div>{username}</div>
</div>

</div>

</div>



{active==="dashboard" && <AdminDashboardContent />}

{active==="patients" && <AdminPatients />}

{active==="doctors" && <AdminDoctors />}

{active==="hospitals" && <AdminHospitals />}

</div>

</div>

)

}

export default AdminPanel;