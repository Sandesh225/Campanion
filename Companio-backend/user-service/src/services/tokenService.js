// src/services/tokenService.js
import jwt from "jsonwebtoken";
import config from "../config/index.js"; // Assuming your config is loading JWT secrets from env variables

// Generate Access Token
export const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    config.jwtSecret, // Make sure this comes from your environment variable
    { expiresIn: "1h" } // Shorter expiration for access token (e.g., 1 hour)
  );
};

// Generate Refresh Token
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    config.jwtRefreshSecret, // Should be different from access token secret
    { expiresIn: "7d" } // Longer expiration for refresh token (e.g., 7 days)
  );
};

// Verify Access Token
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret); // Verify and decode the access token
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
};

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.jwtRefreshSecret); // Verify and decode the refresh token
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};
