import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure AWS S3
const s3 = new AWS.S3({
  region: process.env.AWS_REGION || "eu-north-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "levinstein-images";

// CORS configuration for production
const corsOptions = {
  origin: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",")
    : [
        "http://localhost:5173", // Local development
        "http://localhost:3001", // Alternative local port
        "https://www.netanelewen.com", // Production domain
        "https://netanelewen.com", // Production domain without www
      ],
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Log CORS configuration
console.log("CORS Origins configured:", corsOptions.origin);

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
  // Add explicit CORS headers
  res.header("Access-Control-Allow-Origin", "https://www.netanelewen.com");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

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

// S3 Images endpoint - List images for a specific collection
app.get("/api/images/:collection", async (req, res) => {
  const { collection } = req.params;

  // Add explicit CORS headers
  res.header("Access-Control-Allow-Origin", "https://www.netanelewen.com");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (!collection) {
    return res.status(400).json({
      success: false,
      message: "Collection parameter is required",
    });
  }

  try {
    const params = {
      Bucket: BUCKET_NAME,
      Prefix: `assets/${collection}/`,
      MaxKeys: 1000, // Adjust as needed
    };

    const data = await s3.listObjectsV2(params).promise();

    // Filter for image files only
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".JPG",
      ".JPEG",
      ".PNG",
      ".GIF",
      ".WEBP",
    ];
    const images = data.Contents.filter((obj) => {
      const ext = obj.Key.split(".").pop().toLowerCase();
      return imageExtensions.includes(`.${ext}`);
    })
      .map((obj) => {
        const filename = obj.Key.split("/").pop();
        return {
          filename,
          url: `https://${BUCKET_NAME}.s3.${
            process.env.AWS_REGION || "eu-north-1"
          }.amazonaws.com/${obj.Key}`,
          size: obj.Size,
          lastModified: obj.LastModified,
        };
      })
      .sort((a, b) => a.filename.localeCompare(b.filename));

    res.status(200).json({
      success: true,
      collection,
      images,
      count: images.length,
    });
  } catch (error) {
    console.error("S3 listing error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to list images from S3",
      error: error.message,
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Email Server is running",
    endpoints: {
      "POST /send-email": "Send contact form email",
      "GET /health": "Health check",
    },
  });
});

app.listen(PORT, () => {
  console.log(`Email server running on port ${PORT}`);
});
