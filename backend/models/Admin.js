const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  adminName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Admin", adminSchema);