
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { rateLimit } = require("express-rate-limit");

const chatRoutes = require("./routes/chatRoutes");
const authRoutes = require("./routes/authRoutes");
const errorMiddleware = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

const MONGODB_URI = process.env.MONGODB_URI;

// General middleware
app.use(
  cors({
    origin: [
      "http://localhost:1234",
      "https://serene-douhua-0cd8aa.netlify.app",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10kb" }));

// Chat rate limiter
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many chat requests. Please try again later.",
  },
});

// Authentication rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many authentication attempts. Please try again later.",
  },
});

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Customer Support Chatbot API is running",
  });
});

// API routes with rate limiting
app.use("/api/chat", chatLimiter);
app.use("/api/auth", authLimiter);

// Existing API routes
app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "API endpoint not found.",
  });
});

// Centralized error handler (must be last)
app.use(errorMiddleware);

// Start server after MongoDB connects
async function startServer() {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not configured");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    await mongoose.connect(MONGODB_URI, {
      dbName: "Customer_Support_Chatbot",
    });

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
