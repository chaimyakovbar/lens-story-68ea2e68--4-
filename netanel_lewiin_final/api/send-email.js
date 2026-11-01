// Contact form -> email. Runs as a Vercel Function (free on the Hobby plan),
// replacing the old Render email server. Needs these env vars in Vercel:
// SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASSWORD, SMTP_TO_EMAIL
import nodemailer from "nodemailer";

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { from_name, from_email, message } = req.body || {};

  if (!from_name || !from_email || !message) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: from_name, from_email, message",
    });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from_email)) {
    return res.status(400).json({ success: false, message: "Invalid email" });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      to: process.env.SMTP_TO_EMAIL,
      from: process.env.SMTP_USER,
      replyTo: from_email,
      subject: `New Contact Form Message from ${String(from_name).slice(0, 100)}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(from_name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(from_email)}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap">${escapeHtml(message)}</p>
      `,
    });

    return res.status(200).json({ success: true, message: "Email sent successfully", info: info.response });
  } catch (error) {
    console.error("Email send error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to send email" });
  }
}
