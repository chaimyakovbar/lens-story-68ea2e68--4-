import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create email server
const emailServer = express();
emailServer.use(cors());
emailServer.use(express.json());

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
emailServer.post("/send-email", async (req, res) => {
  const { from_name, from_email, message, to_name } = req.body;

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
emailServer.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "email-server",
      configureServer(server) {
        server.middlewares.use("/api", emailServer);
      },
    },
  ],
  server: {
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://localhost:5173",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
});
