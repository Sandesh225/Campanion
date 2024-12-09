import express from "express";
import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";
import matchingRoutes from "./routes/matchingRoutes.js";
const app = express();

// Middleware
app.use(helmet());
app.use(express.json()); // Ensure JSON body parsing before routes
app.use(cors());
app.use(mongoSanitize());

app.use(generalLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/matching", matchingRoutes);
// Handle undefined routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    statusCode: 404,
    data: null,
    message: "Route not found",
    errors: ["Invalid endpoint"],
    success: false,
  });
});

const PORT = process.env.PORT || 3000;

// Error Handling Middleware
app.use(errorHandler);

export default app;
