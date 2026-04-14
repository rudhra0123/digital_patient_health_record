const express = require("express");
const Patient = require("../models/Patient");

const router = express.Router();
const { upload } = require("../middleware/upload");
const { uploadRecord } = require("../controllers/PatientController");
const authMiddleware = require("../middleware/authMiddleware");
const Visit = require("../models/Visit");







router.get("/profile", authMiddleware, async (req, res) => {

  const patient = await Patient.findById(req.user.id);

  res.json(patient);

});

router.get("/profile/:patientUid", async (req, res) => {
  try {
    const patient = await Patient.findOne({
      patientUid: req.params.patientUid
    }).select("-password");

    if (!patient) {
      return res.status(404).json({ msg: "Patient not found" });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/update-profile", authMiddleware, async (req, res) => {
  try {

    const patient = await Patient.findById(req.user.id);

    if (!patient) {
      return res.status(404).json({ msg: "Patient not found" });
    }

    const {
      fullName,
      age,
      bloodGroup,
      email,
      gender,
      phone,
      alternatePhone
    } = req.body;

    if (fullName !== undefined) patient.fullName = fullName;
    if (age !== undefined) patient.age = age;
    if (bloodGroup !== undefined) patient.bloodGroup = bloodGroup;
    if (email !== undefined) patient.email = email;
    if (phone !== undefined) patient.phone = phone;
    if (alternatePhone !== undefined) patient.alternatePhone = alternatePhone;

    if (gender) patient.gender = gender;

    patient.profileCompleted = true;

    await patient.save();

    res.json({ msg: "Profile updated successfully", patient });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post(
  "/upload-record/:id",
  upload.single("file"),
  uploadRecord
);

module.exports = router;
