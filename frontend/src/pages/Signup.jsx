import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const signupUser = async () => {

  if (!username.trim()) {
    alert("Username is required");
    return;
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  if (!passwordRegex.test(password)) {
    alert("Password must be at least 6 characters and include letters & numbers");
    return;
  }

  if (password !== confirm) {
    alert("Passwords do not match");
    return;
  }

  try {
    const res = await api.post("/auth/signup", { username, password });
    alert(res.data.msg);

    const loginRes = await api.post("/auth/login", { username, password });
    localStorage.setItem("patientUid", loginRes.data.patientUid);
    localStorage.setItem("username", loginRes.data.username);
    navigate("/dashboard");

  } catch (err) {
    alert(err.response?.data?.msg || "Signup failed");
  }
};


  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Password Field */}
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

        {/* Confirm Password Field */}
        <div className="password-field">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <span
            className="eye-icon"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button onClick={signupUser}>Create Account</button>

        <p>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
