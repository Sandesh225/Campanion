// src/app.js
import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";

import hpp from "hpp";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import matchingRoutes from "./routes/matchingRoutes.js";
import swipeRoutes from "./routes/swipeRoutes.js";
import themeRoutes from "./routes/themeRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";

const app = express();

// Global Middleware
app.use(helmet()); // Set security HTTP headers
app.use(compression()); // Compress responses
app.use(express.json({ limit: "10kb" })); // Body parser, reading data from body into req.body
app.use(cors({ origin: process.env.CLIENT_URL || "*" })); // Enable CORS
app.use(mongoSanitize()); // Data sanitization against NoSQL query injection

app.use(hpp()); // Prevent HTTP Parameter Pollution

app.use(generalLimiter); // Apply rate limiting

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/matching", matchingRoutes);
app.use("/api/swipe", swipeRoutes);
app.use("/api/theme", themeRoutes);

// Handle undefined routes
app.all("*", (req, res) => {
  res.status(404).json({
    statusCode: 404,
    data: null,
    message: "Route not found",
    errors: ["Invalid endpoint"],
    success: false,
  });
});

// Error Handling Middleware
app.use(errorHandler);

export default app;
