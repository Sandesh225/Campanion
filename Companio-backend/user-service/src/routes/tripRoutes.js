// src/routes/tripRoutes.js
import express from "express";
import {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  addParticipant,
  updateParticipant,
  addMilestone,
  updateMilestone,
  deleteMilestone,
  addWaypoint,
  deleteWaypoint,
} from "../controllers/tripController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validateRequest from "../middlewares/validateRequest.js";
import {
  createTripSchema,
  updateTripSchema,
  addParticipantsSchema,
  updateParticipantSchema,
  milestoneSchema,
  waypointSchema,
} from "../validations/tripValidation.js";

const router = express.Router();

// Apply authentication middleware
router.use(authMiddleware);

// Trip CRUD
router.post("/", validateRequest(createTripSchema), createTrip);
router.get("/", getUserTrips);
router.get("/:id", getTripById);
router.put("/:id", validateRequest(updateTripSchema), updateTrip);
router.delete("/:id", deleteTrip);

// Participants management
router.post(
  "/:id/participants",
  validateRequest(addParticipantsSchema),
  addParticipant
);
router.put(
  "/:id/participants/:participantId",
  validateRequest(updateParticipantSchema),
  updateParticipant
);

// Milestones management
router.post("/:id/milestones", validateRequest(milestoneSchema), addMilestone);
router.put(
  "/:id/milestones/:milestoneId",
  validateRequest(milestoneSchema),
  updateMilestone
);
router.delete("/:id/milestones/:milestoneId", deleteMilestone);

// Waypoints management
router.post("/:id/waypoints", validateRequest(waypointSchema), addWaypoint);
router.delete("/:id/waypoints/:index", deleteWaypoint);

export default router;
