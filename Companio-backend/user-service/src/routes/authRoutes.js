// src/routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  refreshTokenHandler,
  logout,
  getMe,
} from "../controllers/authController.js";
import validateRequest from "../middlewares/validateRequest.js";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
} from "../validations/authValidation.js";
import { loginLimiter } from "../middlewares/rateLimiter.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Registration
router.post("/register", validateRequest(registerSchema), register);

// Login with rate limiting
router.post("/login", loginLimiter, validateRequest(loginSchema), login);

// Refresh Token
router.post(
  "/refresh-token",
  validateRequest(refreshTokenSchema),
  refreshTokenHandler
);

// Get current user profile (Protected)
router.get("/me", authMiddleware, getMe);

// Logout
router.post("/logout", validateRequest(logoutSchema), logout);

export default router;
