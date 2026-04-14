const express = require("express");
const router = express.Router();
const {upload}= require("../middleware/upload");
const { addHospital, getHospitals } = require("../controllers/HospitalController");
const authMiddleware = require("../middleware/authMiddleware");
const { getHospitalDashboard,getPatientVisits,uploadRecord} = require("../controllers/HospitalController");

router.get("/dashboard", authMiddleware, getHospitalDashboard);

router.get("/patient-visits/:patientUid", authMiddleware, getPatientVisits);
router.post("/upload-record", authMiddleware, upload.single("file"), uploadRecord);

router.post("/add-hospital",addHospital);

router.get("/hospitals", getHospitals);

module.exports = router;