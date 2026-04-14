const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["patient", "doctor", "admin", "hospital"],
    required: true
  },

  refId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "roleRef"
  },

  roleRef: {
    type: String,
    enum: ["Patient", "Doctor", "Admin", "Hospital"]
  }

});

module.exports = mongoose.model("User", userSchema);