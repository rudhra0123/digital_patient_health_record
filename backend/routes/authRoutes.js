const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");
const generatePatientId = require("../utils/generatePatientId");
const User = require("../models/User");
const Hospital = require("../models/Hospital");
const Doctor = require("../models/Doctor");
// const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: "All fields required" });
  }

  const userExists = await Patient.findOne({ username });
  if (userExists) {
    return res.status(400).json({ msg: "Username already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const patientUid = await generatePatientId();

const patient = await Patient.create({
  username,
  password: hashedPassword,
  patientUid
});


await User.create({
  username,
  password: hashedPassword,
  role: "patient",
  refId: patient._id,
  roleRef: "Patient"
});

  res.json({ msg: "Account created successfully" });
});


router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  let patientUid = null;
  let hospitalUid = null;
  let hospitalName = null;
  let doctorUid = null;


  if (!user) {
    return res.status(400).json({ msg: "Account not found. Please sign up." });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid password" });
  }


  if (user.role === "patient") {
    const patient = await Patient.findById(user.refId);
    if (patient) {
      patientUid = patient.patientUid;
    }
  }
  if (user.role === "hospital") {
  const hospital = await Hospital.findById(user.refId);
  if (hospital) {
    hospitalUid = hospital.hospitalUid;   
    hospitalName = hospital.name;
  }
}

if (user.role === "doctor") {
  const doctor = await Doctor.findById(user.refId);
  if (doctor) {
    doctorUid = doctor.doctorUid; 
  }
}

  const token = jwt.sign(
    {
      id: user.refId,
      role: user.role,
      username: user.username,
      name: user.name,
    },
    "health_secret_key",
    { expiresIn: "1d" }
  );

  res.json({
    msg: "Login successful",
    token,
    role: user.role,
    username: user.username,
    patientUid,
    hospitalUid,
    hospitalName,
  });
});

module.exports = router;
