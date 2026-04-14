const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Admin = require("../models/Admin");
const User = require("../models/User");

mongoose.connect("mongodb+srv://rudhradb:9391821599@patienthealth.nhsfeos.mongodb.net/patient_health?retryWrites=true&w=majority&appName=patienthealth");

async function createAdmin() {

  try {

    const username = "Admin";
    const password = "123456";

    // check if admin already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // create admin profile
    const admin = await Admin.create({
      adminName: "Super Admin",
      email: "admin@health.com"
    });

    // create login account
    await User.create({
      username,
      password: hashedPassword,
      role: "admin",
      refId: admin._id,
      roleRef: "Admin"
    });

    console.log("Admin account created successfully");
    console.log("Username: Admin");
    console.log("Password: 123456");

    process.exit();

  } catch (err) {
    console.error(err);
    process.exit();
  }

}

createAdmin();