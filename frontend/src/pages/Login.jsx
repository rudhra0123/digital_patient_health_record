import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);

if (res.data.patientUid) localStorage.setItem("patientUid", res.data.patientUid);
if (res.data.hospitalUid) localStorage.setItem("hospitalUid", res.data.hospitalUid);  
if (res.data.hospitalName) localStorage.setItem("hospitalName", res.data.hospitalName); 
if (res.data.doctorUid) localStorage.setItem("doctorUid", res.data.doctorUid);
      alert(res.data.msg);
      if (res.data.role === "admin") navigate("/admin/panel");
      else if (res.data.role === "patient") navigate("/dashboard");
      else if (res.data.role === "hospital") navigate("/hospital/panel");
      else if(res.data.role === "doctor") navigate("/doctor/panel");
      

    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button onClick={loginUser}>Login</button>

        <p>
          Don’t have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
