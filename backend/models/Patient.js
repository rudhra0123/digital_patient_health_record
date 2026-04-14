const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  patientUid: {
    type: String,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: String,
  age: Number,
  bloodGroup: String,
  email: String,

  gender: {
    type: String,
    enum: ["Male", "Female", "Other"]
  },
  
  phone: String,
  alternatePhone: String,

  profileImages: [String],

  profileCompleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  faceRegistered: {
  type: Boolean,
  default: false
}
});

module.exports = mongoose.model("Patient", patientSchema);
