const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  doctorUid: {
  type: String,
  unique: true
},

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  specialization: {
    type: String
  },

  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital"
  },
  experience:{
  type:Number,
  min:0
},
  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Doctor", doctorSchema);