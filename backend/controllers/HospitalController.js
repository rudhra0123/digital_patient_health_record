const Hospital = require("../models/Hospital");
const User = require("../models/User"); 
const bcrypt = require("bcryptjs"); 
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Visit = require("../models/Visit");
const { uploadToS3 } = require("../middleware/upload");
const Record = require("../models/Record");


exports.addHospital = async (req, res) => {
  try {
    const { name, location, contact, username, password } = req.body;

    // ✅ generate unique hospitalUid
    const lastHospital = await Hospital.findOne().sort({ createdAt: -1 });
    let lastNum = 1000;
    if (lastHospital && lastHospital.hospitalUid) {
      const num = parseInt(lastHospital.hospitalUid.replace("HOS", ""));
      if (!isNaN(num) && num < 9999) {
        lastNum = num;
      }
    }
    const hospitalUid = "HOS" + (lastNum + 1); // ✅ defined here

    const hospital = new Hospital({
      name,
      location,
      contact,
      hospitalUid  // ✅ now it's defined
    });
    await hospital.save();

    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      role: "hospital",
      refId: hospital._id,
      roleRef: "Hospital"
    });
    await user.save();

    res.json({ message: "Hospital added successfully", hospital });

  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getHospitalDashboard = async (req, res) => {
  try {
    const hospitalId = req.user.id; // from token

    // ✅ total doctors in this hospital
    const totalDoctors = await Doctor.countDocuments({ hospital: hospitalId });

    // ✅ all visits in this hospital
    const visits = await Visit.find({ hospital: hospitalId });

    // ✅ total unique patients visited
    const uniquePatients = new Set(visits.map(v => v.patient.toString())).size;

    // ✅ treatment types (specializations)
    const doctors = await Doctor.find({ hospital: hospitalId }).select("specialization");
    const treatments = [...new Set(doctors.map(d => d.specialization).filter(Boolean))];

    // ✅ avg patients per day
    const totalDays = visits.length > 0
      ? Math.ceil((new Date() - new Date(visits[visits.length - 1].visitDate)) / (1000 * 60 * 60 * 24))
      : 1;
    const avgPatients = (uniquePatients / totalDays).toFixed(1);

    res.json({
      totalDoctors,
      totalPatients: uniquePatients,
      treatments,
      avgPatients
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPatientVisits = async (req, res) => {
  try {
    const { patientUid } = req.params;
    const hospitalId = req.user.id;

    const patient = await Patient.findOne({ patientUid });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const doctors = await Doctor.find({ hospital: hospitalId }).select("_id");
    const doctorIds = doctors.map(d => d._id);

    const visits = await Visit.find({
      patient: patient._id,
      doctor: { $in: doctorIds }
    })
      .populate("doctor", "name specialization")
      .sort({ visitDate: -1 });

    res.json({ patient, visits });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.uploadRecord = async (req, res) => {
  try {
    const { patientUid, visitId, reason } = req.body;

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const visit = await Visit.findById(visitId)
      .populate("doctor", "name")
    const hospital = await Hospital.findById(req.user.id);
    const hospitalName = hospital?.name || "Unknown Hospital";

    if (!visit) return res.status(404).json({ message: "Visit not found" });

    const fileKey = await uploadToS3(req.file);
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    const record = await Record.create({
      patientUid,
      visitId,                         
      hospital: hospitalName,
      doctor: visit.doctor?.name || "",
      visitDate: visit.visitDate,
      reason,
      fileUrl,
      fileKey
    });

    res.json({ message: "Record uploaded successfully", record });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};