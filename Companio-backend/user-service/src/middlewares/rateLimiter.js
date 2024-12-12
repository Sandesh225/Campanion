// src/middlewares/rateLimiter.js
import rateLimit from "express-rate-limit";

// General rate limiter for all requests
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    statusCode: 429,
    data: null,
    message: "Too many requests from this IP, please try again later.",
    errors: ["Rate limit exceeded"],
    success: false,
  },
});

// Specific rate limiter for login to prevent brute-force
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 login requests per windowMs
  message: {
    statusCode: 429,
    data: null,
    message: "Too many login attempts from this IP, please try again later.",
    errors: ["Rate limit exceeded"],
    success: false,
  },
});
