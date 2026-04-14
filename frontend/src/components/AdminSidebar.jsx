import { Link } from "react-router-dom";

function AdminSidebar(){

return(

<div style={{
width:"220px",
background:"#1f2937",
color:"white",
height:"100vh",
padding:"20px"
}}>

<h2>Admin</h2>

<ul style={{listStyle:"none", padding:0}}>

<li>
<Link to="/admin/dashboard">Dashboard</Link>
</li>

<li>
<Link to="/admin/patients">Patients</Link>
</li>

<li>
<Link to="/admin/doctors">Doctors</Link>
</li>

<li>
<Link to="/admin/hospitals">Hospitals</Link>
</li>

</ul>

</div>

)

}

export default AdminSidebar;