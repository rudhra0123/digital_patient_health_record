const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    default: null
  },
  diagnosis: {
    type: String,
    default: ""
  },
  prescription: {
    type: String,
    default: ""
  },
  notes: {
    type: String,
    default: ""
  },
  visitDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Visit", visitSchema);