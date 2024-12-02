// src/routes/flightRoutes.js
import express from "express";
import { findFlights } from "../controllers/flightController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply authentication middleware
router.use(authMiddleware);

// @route GET /api/flights/search
router.get("/search", findFlights);

export default router;
