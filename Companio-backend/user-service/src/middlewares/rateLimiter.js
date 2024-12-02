// src/middlewares/rateLimiter.js
import rateLimit from "express-rate-limit";

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    statusCode: 429,
    data: null,
    message: "Too many requests, please try again later.",
    errors: ["Rate limit exceeded"],
    success: false,
  },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 login requests per windowMs
  message: {
    statusCode: 429,
    data: null,
    message: "Too many login attempts, please try again later.",
    errors: ["Rate limit exceeded"],
    success: false,
  },
});

export { generalLimiter, loginLimiter };
