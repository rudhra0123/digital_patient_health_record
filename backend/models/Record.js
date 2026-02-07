const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },

  hospitalName: {
    type: String,
    required: true
  },

  doctorName: {
    type: String,
    required: true
  },

  visitDate: {
    type: Date,
    required: true
  },

  summaryText: {
    type: String
  },

  pdfUrl: {
    type: String,
    required: true
  },

  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Record", recordSchema);
