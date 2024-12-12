// src/routes/themeRoutes.js
import express from "express";
import {
  getThemePreference,
  setThemePreference,
} from "../controllers/themeController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply authentication middleware to all theme routes
router.use(authMiddleware);

/**
 * @route GET /api/theme
 * @desc Get the current user's theme preference
 * @access Private
 */
router.get("/", getThemePreference);

/**
 * @route PUT /api/theme
 * @desc Set the current user's theme preference
 * @access Private
 */
router.put("/", setThemePreference);

export default router;
