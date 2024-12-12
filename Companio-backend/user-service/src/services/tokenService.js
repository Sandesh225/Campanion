import jwt from "jsonwebtoken";
import config from "../config/index.js";

// Generate Access Token
export const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role }, // Ensure 'id' is used consistently
    config.jwtSecret,
    { expiresIn: "1h" }
  );
};

// Generate Refresh Token
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId }, // Consistently use 'id'
    config.jwtRefreshSecret,
    { expiresIn: "7d" }
  );
};

// Verify Access Token
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
};

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.jwtRefreshSecret);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};
