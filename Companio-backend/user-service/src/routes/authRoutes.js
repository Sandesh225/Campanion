// src/routes/authRoutes.js

import express from "express";
import {
  register,
  login,
  refreshToken,
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

// Registration Route
router.post("/register", validateRequest(registerSchema), register);

// Login Route with rate limiting
router.post("/login", loginLimiter, validateRequest(loginSchema), login);

// Refresh Token Route
router.post(
  "/refresh-token",
  validateRequest(refreshTokenSchema),
  refreshToken
);

// Get current user
router.get("/me", authMiddleware, getMe);

// Logout Route
router.post("/logout", validateRequest(logoutSchema), logout);

// Password Reset Routes

export default router;
