// src/controllers/authController.js
import {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
} from "../utils/ApiError.js";
import { User } from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../services/tokenService.js";
import bcrypt from "bcryptjs";

// Placeholder for email sending function
// Implement actual email sending using nodemailer or any email service
const sendEmail = async (to, subject, text) => {
  // Implementation depends on your email service provider
  console.log(`Sending email to ${to}: ${subject} - ${text}`);
};

/**
 * Register a new user.
 * @route POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { username, email, password, profile } = req.body;

    // Check if email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      throw new ConflictError("Email or username already in use.");
    }

    // Create user
    const user = new User({
      username,
      email,
      password, // Will be hashed via pre-save hook
      profile,
      role: "user",
    });

    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to user
    user.tokens.refreshToken = refreshToken;
    await user.save();

    // Optionally, send verification email
    // user.generateVerificationToken();
    // await user.save();
    // sendEmail(user.email, "Verify Your Email", `Verification Token: ${user.tokens.verificationToken}`);

    // Respond with user info and tokens
    res.status(201).json({
      statusCode: 201,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        accessToken,
        refreshToken,
      },
      message: "User registered successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticate user and provide tokens.
 * @route POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Email/Username and password are required.");
    }

    // Find user by email or username, include password and security fields
    const user = await User.findOne({
      $or: [{ email: email }, { username: email }],
    }).select("+password +security");

    if (!user) {
      throw new UnauthorizedError("Invalid credentials.");
    }

    // Check if account is locked
    if (user.security.lockoutUntil && user.security.lockoutUntil > Date.now()) {
      const lockoutTimeRemaining = Math.ceil(
        (user.security.lockoutUntil - Date.now()) / 60000
      ); // in minutes
      throw new UnauthorizedError(
        `Account is locked. Try again in ${lockoutTimeRemaining} minutes.`
      );
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      // Increment failed login attempts
      user.security.failedLoginAttempts += 1;

      // Lock account if failed attempts exceed threshold (e.g., 5)
      if (user.security.failedLoginAttempts >= 5) {
        user.security.lockoutUntil = Date.now() + 30 * 60 * 1000; // 30 minutes lockout
        user.security.failedLoginAttempts = 0; // Reset counter
      }

      await user.save();

      throw new UnauthorizedError("Invalid credentials.");
    }

    // Reset failed login attempts on successful login
    user.security.failedLoginAttempts = 0;
    user.security.lockoutUntil = undefined;
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to user
    user.tokens.refreshToken = refreshToken;
    await user.save();

    // Respond with tokens
    res.status(200).json({
      statusCode: 200,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          // Add other user fields as needed
        },
      },
      message: "Login successful.",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token using a refresh token.
 * @route POST /api/auth/refresh-token
 */
const refreshTokenHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new BadRequestError("Refresh token is required.");
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    const userId = decoded.userId;

    // Find user and validate refresh token
    const user = await User.findById(userId);
    if (!user || user.tokens.refreshToken !== refreshToken) {
      throw new UnauthorizedError("Invalid refresh token.");
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(userId, user.role);

    // Generate a new refresh token
    const newRefreshToken = generateRefreshToken(userId);
    user.tokens.refreshToken = newRefreshToken;
    await user.save();

    // Respond with new tokens
    res.status(200).json({
      statusCode: 200,
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
      message: "Access token refreshed successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout a user by invalidating the refresh token.
 * @route POST /api/auth/logout
 */
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new BadRequestError("Refresh token is required.");
    }

    // Decode token to get user ID
    const decoded = verifyRefreshToken(refreshToken);
    const userId = decoded.userId;

    // Find user and remove refresh token
    const user = await User.findById(userId);
    if (user) {
      user.tokens.refreshToken = null;
      await user.save();
    }

    // Respond with success message
    res.status(200).json({
      statusCode: 200,
      data: null,
      message: "Logged out successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Request password reset.
 * @route POST /api/auth/request-password-reset
 */
const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // To prevent email enumeration, respond with success message
      return res.status(200).json({
        statusCode: 200,
        data: null,
        message:
          "If that email address is in our system, we have sent a password reset link.",
        errors: [],
        success: true,
      });
    }

    // Generate password reset token
    user.generatePasswordReset();
    await user.save();

    // Send password reset email
    const resetLink = `${config.clientURL}/reset-password?token=${user.tokens.passwordResetToken}`;
    await sendEmail(
      user.email,
      "Password Reset Request",
      `Hello ${user.username},\n\nYou requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.\n\nThank you!`
    );

    // Respond with success message
    res.status(200).json({
      statusCode: 200,
      data: null,
      message:
        "If that email address is in our system, we have sent a password reset link.",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password using token.
 * @route POST /api/auth/reset-password
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    // Find user by password reset token and ensure token hasn't expired
    const user = await User.findOne({
      "tokens.passwordResetToken": token,
      "tokens.passwordResetTokenExpiry": { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      throw new BadRequestError("Invalid or expired password reset token.");
    }

    // Update password
    user.password = newPassword;
    user.tokens.passwordResetToken = null;
    user.tokens.passwordResetTokenExpiry = null;
    await user.save();

    // Optionally, send confirmation email
    await sendEmail(
      user.email,
      "Password Reset Successful",
      `Hello ${user.username},\n\nYour password has been reset successfully.\n\nIf you did not perform this action, please contact our support immediately.\n\nThank you!`
    );

    res.status(200).json({
      statusCode: 200,
      data: null,
      message: "Password has been reset successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export {
  register,
  login,
  refreshTokenHandler as refreshToken,
  logout,
  requestPasswordReset,
  resetPassword,
};
