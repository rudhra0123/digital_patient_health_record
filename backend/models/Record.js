const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  patientUid: {
    type: String,
    required: true
  },
  visitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Visit",
    default: null 
  },
  hospital: {
    type: String,
    required: true
  },
  doctor: {
    type: String,
    required: true
  },
  reason: String,
  visitDate: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileKey: {
    type: String,
    required: false
  },
  summary: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Record", recordSchema);