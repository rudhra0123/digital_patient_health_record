import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import EditProfile from "./pages/EditProfile";
import DoctorDashboard from "./pages/Doctor/DoctorDashBoard";
import DoctorPanel from "./pages/Doctor/DoctorPanel";
import SearchPatient from "./pages/Doctor/SearchPatient";
import VisitNotes from "./pages/Doctor/VisitNotes";
import HospitalPanel from "./pages/Hospital/HospitalPanel";
import HospitalDashboard from "./pages/Hospital/HospitalDashboard";
import AddRecords from "./pages/Hospital/AddRecords";
import AdminPatients from "./pages/Admin/AdminPatients";
import AdminDoctors from "./pages/Admin/AdminDoctors";
import AdminHospitals from "./pages/Admin/AdminHospital";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminPanel from "./pages/Admin/AdminPanel";
import HelpPage from "./pages/help";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patient-view/:id" element={<Dashboard />} />
        <Route path="/visit-notes" element={<VisitNotes />} />
         
        <Route path="/doctor/panel" element={<DoctorPanel />} />
        <Route path="/doctor/search-patient" element={<SearchPatient />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/hospital/panel" element={<HospitalPanel />} />
        <Route path="/hospital/dashboard" element={<HospitalDashboard/>} />
        <Route path="/hospital/add-records" element={<AddRecords />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/doctors" element={<AdminDoctors />} />
        <Route path="/admin/hospitals" element={<AdminHospitals />} />
        <Route path="/admin/patients" element={<AdminPatients />} />
        <Route path="/admin/panel" element={<AdminPanel />} />
        <Route path="/help" element={<HelpPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

