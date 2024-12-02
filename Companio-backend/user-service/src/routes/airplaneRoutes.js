// src/routes/airplaneRoutes.js
import express from "express";
import { trackFlight } from "../controllers/airplaneController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply authentication middleware
router.use(authMiddleware);

// @route GET /api/airplanes/:flightNumber
router.get("/:flightNumber", trackFlight);

export default router;
