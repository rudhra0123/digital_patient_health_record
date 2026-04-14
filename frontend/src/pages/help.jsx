import { useState } from "react";
import axios from "axios";
import "../styles/help.css";

const faqs = [
  { q: "How do I update my profile?", a: "Go to Edit Profile from your dashboard sidebar to update your personal and medical details." },
  { q: "How do I view my medical records?", a: "Click on View History in your patient dashboard to see all uploaded records." },
  { q: "How do I register my face for emergency search?", a: "Go to Edit Profile and scroll down to the Register Face section to upload your photos." },
  { q: "Who can view my medical records?", a: "Only authorized doctors and hospital staff can view your records securely." },
  { q: "How do I contact my hospital?", a: "Use the contact form below to reach out to the admin for hospital contact details." },
];

function HelpPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const role = localStorage.getItem("role");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.subject || !form.message) {
      alert("Please fill all fields!");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/help/contact",
        { ...form, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError("Failed to send message! Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="help-wrap">

    
      <div className="help-hero">
        <div className="help-hero-badge">🆘 Support Center</div>
        <h1>How can we<br />help you?</h1>
        <p>Get answers fast or reach out to our admin team directly.</p>
        <div className="help-hero-stats">
          <div className="help-stat">
            <div className="help-stat-num">5</div>
            <div className="help-stat-label">FAQ Topics</div>
          </div>
          <div className="help-stat">
            <div className="help-stat-num">24h</div>
            <div className="help-stat-label">Response Time</div>
          </div>
          <div className="help-stat">
            <div className="help-stat-num">100%</div>
            <div className="help-stat-label">Secure & Private</div>
          </div>
        </div>
      </div>


      <div className="help-grid">

   
        <div>
          <div className="help-card">
            <div className="help-card-header">
              <div className="help-section-label">Quick Answers</div>
              <div className="help-section-title">Frequently Asked Questions</div>
            </div>
            <div className="faq-list">
              {faqs.map((faq, i) => (
                <div
                  className="faq-item"
                  key={i}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="faq-question">
                    <span>{faq.q}</span>
                    <span className={`faq-chevron ${openFaq === i ? "open" : ""}`}>▼</span>
                  </div>
                  <div className={`faq-answer ${openFaq === i ? "open" : ""}`}>
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>
          </div>

  
          {/* <div className="help-card" style={{ marginTop: "24px" }}>
            <div className="help-card-header">
              <div className="help-section-label">Navigation</div>
              <div className="help-section-title">Quick Links</div>
            </div>
            <div className="quick-links">
              {[
                { icon: "👤", text: "Edit Profile", sub: "Update your personal details" },
                { icon: "📋", text: "View History", sub: "See your medical records" },
                { icon: "📷", text: "Register Face", sub: "For emergency identification" },
              ].map((link, i) => (
                <div className="quick-link-item" key={i}>
                  <div className="quick-link-icon">{link.icon}</div>
                  <div>
                    <div className="quick-link-text">{link.text}</div>
                    <div className="quick-link-sub">{link.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>

    
        <div className="help-card">
          <div className="help-card-header">
            <div className="help-section-label">Get In Touch</div>
            <div className="help-section-title">Contact Admin Team</div>
          </div>
          <div className="help-form-body">

            {success && (
              <div className="alert-success">
                ✅ Message sent! Admin will get back to you soon.
              </div>
            )}
            {error && (
              <div className="alert-error">
                ❌ {error}
              </div>
            )}

            <div className="form-row">
              <div className="form-group-h">
                <label>Your Name</label>
                <input
                  type="text" name="name"
                  placeholder="e.g. John Smith"
                  value={form.name} onChange={handleChange}
                />
              </div>
              <div className="form-group-h">
                <label>Your Email</label>
                <input
                  type="email" name="email"
                  placeholder="your@email.com"
                  value={form.email} onChange={handleChange}
                />
              </div>
              <div className="form-group-h full-width">
                <label>Subject</label>
                <input
                  type="text" name="subject"
                  placeholder="e.g. Issue with my records"
                  value={form.subject} onChange={handleChange}
                />
              </div>
              <div className="form-group-h full-width">
                <label>Message</label>
                <textarea
                  name="message" rows={6}
                  placeholder="Describe your problem or question in detail..."
                  value={form.message} onChange={handleChange}
                />
              </div>
            </div>

            <button
              className="btn-submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Sending..." : "📧 Send Message"}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default HelpPage;