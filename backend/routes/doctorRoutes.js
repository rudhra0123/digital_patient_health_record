const express = require("express");

const router = express.Router();

const { addDoctor, getDoctors } = require("../controllers/doctorController");
const { recordVisit, addVisitNotes } = require("../controllers/doctorController");
const {doctorDashboard} = require("../controllers/doctorController");
const authMiddleware = require("../middleware/authMiddleware");
const { getPatientProfile } = require("../controllers/doctorController");
const {addVisit}=require("../controllers/doctorController");

router.get("/patient/:id", getPatientProfile);

router.post("/record-visit", recordVisit);
router.put("/add-visit-notes", addVisitNotes);
router.post("/add-visit", authMiddleware,addVisit);
router.post("/add-doctor",addDoctor);

router.get("/doctors",getDoctors);
router.get("/dashboard",authMiddleware,doctorDashboard);

module.exports = router;