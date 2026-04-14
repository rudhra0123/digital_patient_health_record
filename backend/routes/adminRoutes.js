const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");

const adminAuth = require("../middleware/adminauth");
const authMiddleware = require("../middleware/authMiddleware");

const {
getDashboardStats,
getDashboardData,
searchPatient,
searchDoctor,
searchHospital,
getDoctorDetails,
getHospitalDetails,
deleteDoctor,
deleteHospital,
} = require("../controllers/AdminController");

// router.get("/dashboard", adminAuth, getDashboardStats);
// router.get("/dashboard-data", adminAuth, getDashboardData);
router.get("/dashboard",adminController.getDashboardData);

router.get("/doctor/:id", getDoctorDetails);
router.get("/hospital/:id", getHospitalDetails);

router.delete("/doctor/:id", deleteDoctor);
router.delete("/hospital/:id", deleteHospital);

router.get("/search-patient", authMiddleware, searchPatient);
router.get("/search-doctor", searchDoctor);
router.get("/search-hospital", searchHospital);

module.exports = router;