const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
connectDB();
app.use(cors());
// app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Test route
app.get("/", (req, res) => {
  res.send("Patient Health Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const patientRoutes = require("./routes/patientRoutes");
app.use("/api/patient", patientRoutes);
require("dotenv").config();
console.log("S3 Bucket:", process.env.AWS_BUCKET_NAME);
const s3 = require("./config/s3");
console.log("S3 client ready:", !!s3);
const recordRoutes = require("./routes/recordRoutes");
app.use("/api/records", recordRoutes);
const hospitalRoutes = require("./routes/hospitalRoutes");
app.use("/api/hospital", hospitalRoutes);
const doctorRoutes = require("./routes/doctorRoutes");

app.use("/api/doctor",doctorRoutes);

const adminRoutes =require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const mlRoutes = require("./routes/mlRoutes");
app.use("/api/ml", mlRoutes);
const helpRoutes = require("./routes/helpRoutes");
app.use("/api/help", helpRoutes);
const notificationRoutes = require("./routes/NotificationRoute");
app.use("/api/patient", notificationRoutes);



