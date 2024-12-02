// src/routes/quickActionRoutes.js
import express from "express";
import { getQuickActions } from "../controllers/quickActionController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply authentication middleware
router.use(authMiddleware);

// @route GET /api/quick-actions
router.get("/", getQuickActions);

export default router;
