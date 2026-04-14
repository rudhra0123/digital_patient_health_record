const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    await resend.emails.send({
      from: "HealthCare System <onboarding@resend.dev>", 
      to,
      subject,
      html
    });
    console.log("✅ Email sent to:", to);
  } catch (err) {
    console.log("❌ Email failed:", err.message);
  }
};

module.exports = sendEmail;