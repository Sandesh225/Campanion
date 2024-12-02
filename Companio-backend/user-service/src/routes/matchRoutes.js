// src/routes/matchRoutes.js

import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getMatches } from "../controllers/matchController.js";

const router = express.Router();

/**
 * @route GET /api/matches
 * @desc Retrieve user's matches
 * @access Protected
 */
router.get("/", authMiddleware, getMatches);

export default router;
