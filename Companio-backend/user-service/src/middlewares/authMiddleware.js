// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { UnauthorizedError } from "../utils/ApiError.js";
import config from "../config/index.js";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    return next(new UnauthorizedError("Authorization token missing."));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Find user
    const user = await User.findById(decoded.userId).select(
      "-password -tokens"
    );
    if (!user) {
      throw new UnauthorizedError("User not found.");
    }

    // Attach user to request
    req.user = {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
    };

    next();
  } catch (error) {
    // Log the error internally if needed
    console.error("Authentication error:", error);
    return next(new UnauthorizedError("Invalid or expired token."));
  }
};

export default authMiddleware;
