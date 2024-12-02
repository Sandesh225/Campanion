// src/routes/profileRoutes.js

import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getProfiles } from "../controllers/profileController.js";

const router = express.Router();

/**
 * @route GET /api/profiles
 * @desc Fetch profiles based on preferences
 * @access Protected
 */
router.get("/", authMiddleware, getProfiles);

export default router;
