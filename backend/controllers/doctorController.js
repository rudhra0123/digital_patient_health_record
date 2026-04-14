const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Visit = require("../models/Visit");
const bcrypt = require("bcryptjs");
const Patient = require("../models/Patient");
const sendEmail = require("../utils/sendEmail");
const Hospital = require("../models/Hospital");

exports.addDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization, experience, hospital, username } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const count = await Doctor.countDocuments();
const lastDoctor = await Doctor.findOne().sort({ createdAt: -1 });

let lastNum = 1000;
if(lastDoctor && lastDoctor.doctorUid){
  const num = parseInt(lastDoctor.doctorUid.replace("DOC", ""));
  if(!isNaN(num) && num < 9999){ 
    lastNum = num;
  }
}
const doctorUid = "DOC" + (lastNum + 1);
    const doctor = new Doctor({
      name,
      email,
      password: hashedPassword,
      specialization,
      experience,
      hospital,
      doctorUid
    });
    await doctor.save();
    const user = new User({
      username,
      password: hashedPassword,
      role: "doctor",
      refId: doctor._id,
      roleRef: "Doctor"
    });
    await user.save();

    res.json({
      message: "Doctor added successfully",
      doctor
    });

  }  catch (err) {
    console.log("Error:", err); // ✅ add this
    res.status(500).json({ message: err.message }); // ✅ return message not full err
  }
};

exports.getDoctors = async(req,res)=>{

try{

const doctors = await Doctor.find().populate("hospital","name");

res.json(doctors);

}catch(err){

res.status(500).json(err);

}

};

exports.recordVisit = async (req,res)=>{

try{

const {doctorUid, patientUid} = req.body;

const visit = new Visit({
doctor:doctorUid,
patient:patientUid
});

await visit.save();
const patient = await Patient.findById(patientUid);

await sendEmail(
patient.email,
"Medical Record Accessed",
"A doctor has accessed your medical profile."
);

res.json({
message:"Visit recorded and email sent",
visit
});

}catch(err){

res.status(500).json(err);

}

};

exports.addVisitNotes = async (req,res)=>{

try{

const {visitId, notes} = req.body;

const visit = await Visit.findByIdAndUpdate(
visitId,
{notes},
{new:true}
);

res.json(visit);

}catch(err){

res.status(500).json(err);

}

};

exports.doctorDashboard = async (req, res) => {

try {

const doctorId = req.user.id;

const visits = await Visit.find({ doctor: doctorId });

const today = new Date();
today.setHours(0,0,0,0);

const todayPatients = await Visit.countDocuments({
doctor: doctorId,
date: { $gte: today }
});

const patientsViewed = new Set(visits.map(v => v.patient.toString())).size;

res.json({
visits: visits.length,
patientsViewed,
todayPatients
});

} catch (err) {

res.status(500).json({ message: "Server error" });

}

};

exports.getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    res.json({ patient });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addVisit = async (req, res) => {
  try {
    const { patientUid, diagnosis, prescription, notes } = req.body;
    const doctorId = req.user.id;

    // ✅ get patient by patientUid
    const patient = await Patient.findOne({ patientUid });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const visit = new Visit({
      doctor: doctorId,
      patient: patient._id,
      diagnosis,
      prescription,
      notes,
    });

    await visit.save();

    res.json({ message: "Visit added successfully", visit });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientUid: req.params.id })
      .select("-password");
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // ✅ send email to patient
    if (patient.email) {
      await sendEmail(
        patient.email,
        "Your Medical Profile Was Accessed",
        `
          <h2>Profile Access Notification</h2>
          <p>Dear <strong>${patient.fullName || patient.username}</strong>,</p>
          <p>A doctor has accessed your medical profile on <strong>${new Date().toLocaleDateString()}</strong>.</p>
          <p>If you did not authorize this, please contact the admin immediately.</p>
          <br/>
          <p>Regards,</p>
          <p><strong>HealthCare System</strong></p>
        `
      );
    }

    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addVisit = async (req, res) => {
  try {
    const { patientUid, diagnosis, prescription, notes } = req.body;
    const doctorId = req.user.id;

    const patient = await Patient.findOne({ patientUid });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const doctor = await Doctor.findById(doctorId);

    const visit = new Visit({
      doctor: doctorId,
      patient: patient._id,
      hospital: doctor?.hospital || null,
      diagnosis,
      prescription,
      notes,
    });

    await visit.save();

    // ✅ send email to hospital
    if (doctor?.hospital) {
      const hospital = await Hospital.findById(doctor.hospital);
      
      // ✅ get hospital user email
      const User = require("../models/User");
      const hospitalUser = await User.findOne({ 
        refId: hospital._id, 
        role: "hospital" 
      });

      if (hospitalUser) {
        // ✅ find hospital email from User or Hospital
        const hospitalEmail = hospital.contact?.includes("@") 
          ? hospital.contact 
          : null;

        if (hospitalEmail) {
          await sendEmail(
            hospitalEmail,
            "New Patient Visit Added",
            `
              <h2>New Visit Notification</h2>
              <p>Dear <strong>${hospital.name}</strong>,</p>
              <p>Dr. <strong>${doctor.name}</strong> has added a visit for patient <strong>${patient.fullName || patient.username}</strong> (${patient.patientUid}).</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Diagnosis:</strong> ${diagnosis || "—"}</p>
              <p><strong>Prescription:</strong> ${prescription || "—"}</p>
              <p>Please login to upload the relevant reports for this visit.</p>
              <br/>
              <p>Regards,</p>
              <p><strong>HealthCare System</strong></p>
            `
          );
        }
      }
    }

    res.json({ message: "Visit added successfully", visit });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};



