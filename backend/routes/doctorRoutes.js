const express = require("express");

const router = express.Router();

const { addDoctor, getDoctors } = require("../controllers/Doctorcontroller");
const { recordVisit, addVisitNotes } = require("../controllers/Doctorcontroller");
const {doctorDashboard} = require("../controllers/Doctorcontroller");
const authMiddleware = require("../middleware/authMiddleware");
const { getPatientProfile } = require("../controllers/Doctorcontroller");
const {addVisit}=require("../controllers/Doctorcontroller");

router.get("/patient/:id", getPatientProfile);

router.post("/record-visit", recordVisit);
router.put("/add-visit-notes", addVisitNotes);
router.post("/add-visit", authMiddleware,addVisit);
router.post("/add-doctor",addDoctor);

router.get("/doctors",getDoctors);
router.get("/dashboard",authMiddleware,doctorDashboard);

module.exports = router;