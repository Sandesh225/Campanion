// src/routes/greetingRoutes.js
import express from "express";
import { getGreeting } from "../controllers/greetingController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply authentication middleware
router.use(authMiddleware);

// @route GET /api/greetings
router.get("/", getGreeting);

export default router;
