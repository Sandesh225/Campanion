// src/services/tokenService.js
import jwt from "jsonwebtoken";
import config from "../config/index.js";

export const generateAccessToken = (userId, role) => {
  return jwt.sign({ userId, role }, config.jwtSecret, { expiresIn: "15m" });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, config.jwtRefreshSecret, { expiresIn: "7d" });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwtRefreshSecret);
};
