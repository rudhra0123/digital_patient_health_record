const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  hospitalUid: {
  type: String,
  unique: true
},

  location: {
    type: String
  },

  contact: {
    type: String
  },
  email: {
  type: String,
  default: ""
},

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Hospital", hospitalSchema);