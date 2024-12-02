// src/routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  requestPasswordReset,
  resetPassword,
} from "../controllers/authController.js";
import validateRequest from "../middlewares/validateRequest.js";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
} from "../validations/authValidation.js";
import { loginLimiter } from "../middlewares/rateLimiter.js";

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

// Logout Route
router.post("/logout", validateRequest(logoutSchema), logout);

// Password Reset Routes
router.post(
  "/request-password-reset",
  validateRequest(requestPasswordResetSchema),
  requestPasswordReset
);
router.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  resetPassword
);

export default router;
