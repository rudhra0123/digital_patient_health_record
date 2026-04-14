const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendEmail");

router.post("/contact", authMiddleware, async (req, res) => {
  try {
    const { name, email, subject, message, role } = req.body;

    
    await sendEmail(
      "sivaramarajum1@gmail.com",
      `[HealthCare Support] ${subject}`,
      `
        <h2>New Support Message</h2>
        <p><strong>From:</strong> ${name} (${role})</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr/>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <br/>
        <p>Sent from HealthCare System</p>
      `
    );

    await sendEmail(
      email,
      "We received your message!",
      `
        <h2>Thank you for contacting us!</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>We have received your message and will get back to you soon.</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
        <br/>
        <p>Regards,</p>
        <p><strong>HealthCare System Admin</strong></p>
      `
    );

    res.json({ message: "Message sent successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;