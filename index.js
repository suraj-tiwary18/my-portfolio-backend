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
      to: process.env.FROM_EMAIL,
      from: process.env.FROM_EMAIL,   // verified sender
      replyTo: email,                 // user email
      subject: `New message from ${name}`,
      html: `
        <h3>New Contact Message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `
    });

    res.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("SENDGRID ERROR:", error);
    res.status(500).json({ success: false, message: "Email failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
