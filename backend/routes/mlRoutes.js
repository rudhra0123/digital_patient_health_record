const express = require("express");
const router = express.Router();
const axios = require("axios");
const Patient = require("../models/Patient");
const authMiddleware = require("../middleware/authMiddleware");
const { upload } = require("../middleware/upload");
const { uploadToS3 } = require("../middleware/upload");

const ML_URL = "http://127.0.0.1:5001";

router.post("/register-face", authMiddleware, async (req, res) => {
  try {
    const { images } = req.body;
    const patientId = req.user.id;

    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });


    const flaskRes = await axios.post(`${ML_URL}/register`, {
      patientUid: patient.patientUid,
      images
    });

    if (flaskRes.data.status === "SUCCESS") {
  
      patient.faceRegistered = true;
      await patient.save();

      res.json({ message: "Face registered successfully" });
    } else {
      res.status(500).json({ message: "Face registration failed" });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/search-face", authMiddleware, async (req, res) => {
  try {
    const { image } = req.body;

    // ✅ send to Flask
    const flaskRes = await axios.post(`${ML_URL}/identify`, { image });

    if (flaskRes.data.status === "MATCH_FOUND") {
      const patientUid = flaskRes.data.patientUid;
      const confidence = flaskRes.data.confidence;

      const patient = await Patient.findOne({ patientUid }).select("-password");
      if (!patient) return res.status(404).json({ message: "Patient not found" });

      res.json({
        status: "MATCH_FOUND",
        confidence,
        patient
      });
    } else {
      res.json({ status: "NO_MATCH", message: "No matching patient found" });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;