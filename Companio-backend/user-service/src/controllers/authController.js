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

/**
 * Placeholder for an email sending function
 * Implement actual email sending logic here.
 */
const sendEmail = async (to, subject, text) => {
  console.log(`Sending email to ${to}: ${subject} - ${text}`);
};

/**
 * Register a new user.
 * @route POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { username, email, password, profile } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      throw new ConflictError("Email or username already in use.");
    }

    const user = new User({
      username,
      email,
      password,
      profile,
      role: "user",
    });

    await user.save();

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.tokens.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      statusCode: 201,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        accessToken,
        refreshToken,
        themePreference: user.settings.themePreference,
      },
      message: "User registered successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    next(error);
  }
};

/**
 * Login a user.
 * @route POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Email and password are required.");
    }

    const user = await User.findOne({
      $or: [{ email }, { username: email }],
    }).select("+password +security");
    if (!user) {
      throw new UnauthorizedError("Invalid credentials.");
    }

    // Check for account lockout
    if (user.security.lockoutUntil && user.security.lockoutUntil > Date.now()) {
      const lockoutTimeRemaining = Math.ceil(
        (user.security.lockoutUntil - Date.now()) / 60000
      );
      throw new UnauthorizedError(
        `Account locked. Try again in ${lockoutTimeRemaining} minute(s).`
      );
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      user.security.failedLoginAttempts += 1;
      if (user.security.failedLoginAttempts >= 5) {
        user.security.lockoutUntil = Date.now() + 30 * 60 * 1000; // lock for 30 minutes
        user.security.failedLoginAttempts = 0;
      }
      await user.save();
      throw new UnauthorizedError("Invalid credentials.");
    }

    // Reset failed attempts on successful login
    user.security.failedLoginAttempts = 0;
    user.security.lockoutUntil = undefined;

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.tokens.refreshToken = refreshToken;
    user.status.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      statusCode: 200,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          themePreference: user.settings.themePreference,
        },
        accessToken,
        refreshToken,
      },
      message: "Login successful.",
      errors: [],
      success: true,
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    next(error);
  }
};

/**
 * Refresh access token using refresh token.
 * @route POST /api/auth/refresh-token
 */
export const refreshTokenHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new BadRequestError("Refresh token is required.");
    }

    const decoded = verifyRefreshToken(refreshToken);
    const userId = decoded.id; // Changed from 'userId' to 'id'

    const user = await User.findById(userId);
    if (!user || user.tokens.refreshToken !== refreshToken) {
      throw new UnauthorizedError("Invalid refresh token.");
    }

    const newAccessToken = generateAccessToken(userId, user.role);
    const newRefreshToken = generateRefreshToken(userId);
    user.tokens.refreshToken = newRefreshToken;
    await user.save();

    res.status(200).json({
      statusCode: 200,
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
      message: "Access token refreshed successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    console.error("Refresh Token Error:", error.message);
    next(error);
  }
};

/**
 * Logout user by invalidating refresh token.
 * @route POST /api/auth/logout
 */
export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new BadRequestError("Refresh token is required.");
    }

    const decoded = verifyRefreshToken(refreshToken);
    const userId = decoded.id; // Changed from 'userId' to 'id'

    const user = await User.findById(userId);
    if (user) {
      user.tokens.refreshToken = null;
      await user.save();
    }

    res.status(200).json({
      statusCode: 200,
      data: null,
      message: "Logged out successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    console.error("Logout Error:", error.message);
    next(error);
  }
};

/**
 * Get authenticated user's profile.
 * @route GET /api/auth/me
 */
export const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password -tokens");
    if (!user) {
      throw new UnauthorizedError("User not found.");
    }

    res.status(200).json({
      statusCode: 200,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        role: user.role,
      },
      message: "User profile retrieved successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    console.error("GetMe Error:", error.message);
    next(error);
  }
};
