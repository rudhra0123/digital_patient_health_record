const Patient = require("../models/Patient");

const generatePatientId = async () => {

  const lastPatient = await Patient.findOne()
    .sort({ createdAt: -1 })
    .select("patientUid");

  let nextNumber = 1;

  if (lastPatient && lastPatient.patientUid) {
  
    const lastNumber = parseInt(lastPatient.patientUid.split("-")[1]);
    nextNumber = lastNumber + 1;
  }
  const newPatientId = `PAT-${String(nextNumber).padStart(6, "0")}`;

  return newPatientId;
};

module.exports = generatePatientId;
