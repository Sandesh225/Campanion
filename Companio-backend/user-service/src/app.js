// src/app.js
import express from "express";
import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";

const app = express();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(mongoSanitize()); // Prevent MongoDB Operator Injection

app.use(generalLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);

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

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
// Error Handling Middleware
app.use(errorHandler);

export default app;
