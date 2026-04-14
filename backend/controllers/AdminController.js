const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
const User = require("../models/User");
const Notification=require("../models/Notification");

// exports.getDashboardStats = async (req,res)=>{

// try{

// const patients = await Patient.countDocuments();
// const doctors = await Doctor.countDocuments();
// const hospitals = await Hospital.countDocuments();

// res.json({
// patients,
// doctors,
// hospitals
// });

// }catch(err){

// res.status(500).json(err);

// }

// };
const mongoose = require("mongoose");

// exports.searchPatient = async (req,res)=>{

// try{

// const {query} = req.query;

// const patients = await Patient.find({
// $or:[
// {username:{$regex:query,$options:"i"}},
// {patientUid:{$regex:query,$options:"i"}}
// ]
// });

// res.json(patients);

// }catch(err){

// res.status(500).json(err);

// }

// };



exports.searchPatient = async (req, res) => {
  try {
    const { query } = req.query;
    const searcherRole = req.user?.role;
    console.log("req.user:", req.user);
    
    const searcherName = req.user?.username || req.user?.name || "Unknown";

    const patients = await Patient.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { patientUid: { $regex: query, $options: "i" } }
      ]
    });

    if (searcherRole !== "admin" && patients.length > 0) {
      const notifications = patients.map(patient => ({
        patientId: patient._id,
        message: `Your profile was viewed by ${searcherName} (${searcherRole})`,
        searchedBy: searcherName,
        role: searcherRole
      }));
      await Notification.insertMany(notifications);
    }

    res.json(patients);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json(err);
  }
};
exports.searchDoctor = async (req,res)=>{

try{

const {query} = req.query;

const doctors = await Doctor.find({
$or:[
{doctorUid:{$regex:query,$options:"i"}},
{name:{$regex:query,$options:"i"}},
{specialization:{$regex:query,$options:"i"}}
]
}).populate("hospital");

res.json(doctors);

}catch(err){

res.status(500).json(err);

}

};
exports.searchHospital = async (req,res)=>{

try{

const {query} = req.query;

const hospitals = await Hospital.find({
$or:[
{hospitalUid:{$regex:query,$options:"i"}},
{name:{$regex:query,$options:"i"}},
{location:{$regex:query,$options:"i"}}
]
});

res.json(hospitals);

}catch(err){

res.status(500).json(err);

}

};
exports.getDoctorDetails = async (req,res)=>{

try{

const doctor = await Doctor.findById(req.params.id)
.populate("hospital","name location");

res.json(doctor);

}catch(err){

res.status(500).json(err);

}

};
exports.getHospitalDetails = async (req,res)=>{

try{

const hospital = await Hospital.findById(req.params.id);

res.json(hospital);

}catch(err){

res.status(500).json(err);

}

};
exports.deleteDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;

    await Doctor.findByIdAndDelete(doctorId);

    await User.findOneAndDelete({ refId: doctorId, role: "doctor" });

    res.json({ message: "Doctor deleted successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.deleteHospital = async (req,res)=>{

try{

const hospitalId = req.params.id;

await Doctor.deleteMany({ hospital: hospitalId });

await Hospital.findByIdAndDelete(hospitalId);

res.json({
message:"Hospital and related doctors deleted"
});

}catch(err){

res.status(500).json(err);

}

};


exports.getDashboardData = async (req,res)=>{

try{

const totalPatients = await Patient.countDocuments();
const totalDoctors = await Doctor.countDocuments();
const totalHospitals = await Hospital.countDocuments();

const completedProfiles = await Patient.countDocuments({profileCompleted:true});
const incompleteProfiles = await Patient.countDocuments({profileCompleted:false});

const recentPatients = await Patient.find()
.sort({createdAt:-1})
.limit(5)
.select("patientUid username fullName createdAt");

res.json({
totalPatients,
totalDoctors,
totalHospitals,
completedProfiles,
incompleteProfiles,
recentPatients
});

}catch(err){

res.status(500).json(err);

}

};