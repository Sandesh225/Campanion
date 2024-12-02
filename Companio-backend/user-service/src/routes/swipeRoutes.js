// src/routes/swipeRoutes.js

import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { handleSwipe } from "../controllers/swipeController.js";

const router = express.Router();

/**
 * @route POST /api/swipe
 * @desc Handle user swipe actions
 * @access Protected
 */
router.post("/", authMiddleware, handleSwipe);

export default router;
