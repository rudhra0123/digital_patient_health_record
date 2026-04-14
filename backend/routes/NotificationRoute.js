const Notification = require("../models/Notification");

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
router.get("/notifications", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ patientId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/notifications/read", authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { patientId: req.user.id, isRead: false },
      { isRead: true }
    );
    res.json({ msg: "Marked as read" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});
module.exports = router;