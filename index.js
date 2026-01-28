require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

const app = express();
app.use(cors());
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post("/send-message", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await sgMail.send({
      to: process.env.TO_EMAIL,
      from: {
        email: process.env.FROM_EMAIL,
        name: "Portfolio Contact"
      },
      replyTo: email, // user ka email
      subject: `New message from ${name}`,
      html: `
        <h3>New Contact Form Message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });


    res.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("SendGrid Error:", error.response?.body || error.message);
    res.status(500).json({ success: false, message: "Email failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
