// src/routes/landmarkRoutes.js (Updated)
import express from "express";
import {
  getLandmarks,
  getLandmarkFunFacts,
} from "../controllers/landmarkController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply authentication middleware
router.use(authMiddleware);

// @route GET /api/landmarks
router.get("/", getLandmarks);

// @route GET /api/landmarks/:id/fun-facts
router.get("/:id/fun-facts", getLandmarkFunFacts);

export default router;
