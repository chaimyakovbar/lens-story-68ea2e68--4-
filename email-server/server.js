import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for production
const corsOptions = {
  origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [
    "http://localhost:5173", // Local development
    "http://localhost:3000", // Alternative local port
  ],
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Email endpoint
app.post("/send-email", async (req, res) => {
  const { from_name, from_email, message, to_name } = req.body;

  // Validate required fields
  if (!from_name || !from_email || !message) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: from_name, from_email, message",
    });
  }

  try {
    const mailOptions = {
      to: process.env.SMTP_TO_EMAIL,
      from: from_email,
      subject: `New Contact Form Message from ${from_name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${from_name}</p>
        <p><strong>Email:</strong> ${from_email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    
    res.status(200).json({
      success: true,
      message: "Email sent successfully",
      info: info.response,
    });
  } catch (error) {
    console.error("=== Email Send Error ===");
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
    });
    
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "Email Server is running",
    endpoints: {
      "POST /send-email": "Send contact form email",
      "GET /health": "Health check"
    }
  });
});

app.listen(PORT, () => {
  console.log(`Email server running on port ${PORT}`);
}); 