// 1️⃣ Load env variables
require("dotenv").config();

// 2️⃣ Imports
const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

// 3️⃣ App init
const app = express();
const PORT = process.env.PORT || 5000;

// 4️⃣ Middlewares
app.use(cors());
app.use(express.json());

// 5️⃣ SendGrid setup
if (!process.env.SENDGRID_API_KEY) {
  console.error("❌ SENDGRID_API_KEY missing");
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// 6️⃣ Health check route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// 7️⃣ Contact form route
app.post("/send-message", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // 🔒 Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 🔐 Fallback emails (env safety)
    const FROM_EMAIL = process.env.FROM_EMAIL;
    const TO_EMAIL = process.env.TO_EMAIL || FROM_EMAIL;

    if (!FROM_EMAIL || !TO_EMAIL) {
      console.error("❌ FROM_EMAIL or TO_EMAIL missing");
      return res.status(500).json({
        success: false,
        message: "Server email configuration error",
      });
    }

    // 📧 Mail content
    const mailData = {
      to: TO_EMAIL,
      from: {
        email: FROM_EMAIL,
        name: "Portfolio Contact",
      },
      replyTo: email, // user email
      subject: `📩 New Portfolio Message — ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>New Contact Form Message</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Message:</b></p>
          <p>${message}</p>
          <hr />
          <p style="font-size:12px;color:#777">
            Portfolio Contact Form
          </p>
        </div>
      `,
    };

    // 🚀 Send email
    await sgMail.send(mailData);

    return res.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    // 🔥 Clear error logs (important)
    console.error(
      "SendGrid Error:",
      error.response?.body || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Email failed",
    });
  }
});

// 8️⃣ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
