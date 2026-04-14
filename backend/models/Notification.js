const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  message: { type: String, required: true },
  searchedBy: { type: String }, 
  role: { type: String },       
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);