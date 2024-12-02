// src/routes/tripRoutes.js
import express from "express";
import {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from "../controllers/tripController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorize.js";
import validateRequest from "../middlewares/validateRequest.js";
import {
  createTripSchema,
  updateTripSchema,
} from "../validations/tripValidation.js";

const router = express.Router();

// Apply authentication middleware to all trip routes
router.use(authMiddleware);

// Create Trip
router.post("/", validateRequest(createTripSchema), createTrip);

// Get User's Trips
router.get("/", getUserTrips);

// Get Specific Trip
router.get("/:id", getTripById);

// Update Trip
router.put("/:id", validateRequest(updateTripSchema), updateTrip);

// Delete Trip (Soft Delete)
router.delete("/:id", deleteTrip);

export default router;
