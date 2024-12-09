// src/controllers/tripController.js
import {
  ForbiddenError,
  NotFoundError,
  BadRequestError,
} from "../utils/ApiError.js";
import Trip from "../models/Trip.js";

/**
 * Create a new trip.
 * @route POST /api/trips
 */
const createTrip = async (req, res, next) => {
  try {
    const {
      title,
      description,
      origin,
      destination,
      startDate,
      endDate,
      travelMode,
      budget,
      trip_details,
      preferences,
      destinationLocation,
    } = req.body;

    const userId = req.user.id;
    const username = req.user.username;
    const email = req.user.email;

    if (new Date(startDate) > new Date(endDate)) {
      throw new BadRequestError("Start date cannot be after the end date.");
    }

    const trip = new Trip({
      user: userId,
      title,
      description,
      origin,
      destination,
      startDate,
      endDate,
      travelMode,
      budget,
      trip_details,
      preferences,
      destinationLocation,
      participants: [
        {
          userId,
          name: username,
          email: email,
          status: "joined",
          role: "organizer",
          joined_at: new Date(),
        },
      ],
    });

    await trip.save();

    res.status(201).json({
      statusCode: 201,
      data: trip,
      message: "Trip created successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all trips for a user with optional filters.
 * @route GET /api/trips
 */
const getUserTrips = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { destination, is_active, startDate, endDate } = req.query;

    const query = {
      "participants.userId": userId,
    };
    if (destination) query.destination = destination;
    if (typeof is_active !== "undefined") {
      query.is_active = is_active === "true";
    }
    if (startDate && endDate) {
      query.startDate = { $gte: new Date(startDate) };
      query.endDate = { $lte: new Date(endDate) };
    }

    const trips = await Trip.find(query).lean();

    res.status(200).json({
      statusCode: 200,
      data: trips,
      message: "Trips retrieved successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific trip by ID.
 * @route GET /api/trips/:id
 */
const getTripById = async (req, res, next) => {
  try {
    const tripId = req.params.id;
    const userId = req.user.id;

    const trip = await Trip.findById(tripId).lean();
    if (!trip) {
      throw new NotFoundError("Trip not found.");
    }

    const isParticipant = trip.participants.some(
      (p) => p.userId.toString() === userId
    );
    if (!isParticipant && req.user.role !== "admin") {
      throw new ForbiddenError("Access denied.");
    }

    res.status(200).json({
      statusCode: 200,
      data: trip,
      message: "Trip retrieved successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a trip.
 * @route PUT /api/trips/:id
 */
const updateTrip = async (req, res, next) => {
  try {
    const tripId = req.params.id;
    const updates = req.body;
    const userId = req.user.id;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      throw new NotFoundError("Trip not found.");
    }

    const participant = trip.participants.find(
      (p) => p.userId.toString() === userId
    );
    if (!participant || participant.role !== "organizer") {
      throw new ForbiddenError(
        "You do not have permission to update this trip."
      );
    }

    if (updates.startDate && updates.endDate) {
      if (new Date(updates.startDate) > new Date(updates.endDate)) {
        throw new BadRequestError("Start date cannot be after the end date.");
      }
    }

    Object.assign(trip, updates);
    await trip.save();

    res.status(200).json({
      statusCode: 200,
      data: trip,
      message: "Trip updated successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Soft-delete a trip (set is_active to false).
 * @route DELETE /api/trips/:id
 */
const deleteTrip = async (req, res, next) => {
  try {
    const tripId = req.params.id;
    const userId = req.user.id;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      throw new NotFoundError("Trip not found.");
    }

    const participant = trip.participants.find(
      (p) => p.userId.toString() === userId
    );
    if (!participant || participant.role !== "organizer") {
      throw new ForbiddenError(
        "You do not have permission to delete this trip."
      );
    }

    trip.is_active = false;
    await trip.save();

    res.status(200).json({
      statusCode: 200,
      data: null,
      message: "Trip deactivated successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add participants to a trip.
 * @route POST /api/trips/:id/participants
 */
const addParticipant = async (req, res, next) => {
  try {
    const tripId = req.params.id;
    const { participants } = req.body; // [{ userId, name, email }, ...]
    const userId = req.user.id;

    const trip = await Trip.findById(tripId);
    if (!trip) throw new NotFoundError("Trip not found.");

    const organizer = trip.participants.find(
      (p) => p.userId.toString() === userId && p.role === "organizer"
    );
    if (!organizer && req.user.role !== "admin") {
      throw new ForbiddenError("Only organizer or admin can add participants.");
    }

    for (const part of participants) {
      // Avoid duplicates
      if (
        trip.participants.some(
          (p) => p.email.toLowerCase() === part.email.toLowerCase()
        )
      ) {
        continue; // skip already invited participants
      }
      trip.participants.push({
        userId: part.userId,
        name: part.name,
        email: part.email.toLowerCase(),
        status: "invited",
        role: "member",
        joined_at: new Date(),
      });
    }

    await trip.save();

    res.status(200).json({
      statusCode: 200,
      data: trip.participants,
      message: "Participants added successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a participant's status or role.
 * @route PUT /api/trips/:id/participants/:participantId
 */
const updateParticipant = async (req, res, next) => {
  try {
    const tripId = req.params.id;
    const participantId = req.params.participantId;
    const { status, role } = req.body;
    const userId = req.user.id;

    const trip = await Trip.findById(tripId);
    if (!trip) throw new NotFoundError("Trip not found.");

    const organizer = trip.participants.find(
      (p) => p.userId.toString() === userId && p.role === "organizer"
    );

    if (!organizer && req.user.role !== "admin") {
      throw new ForbiddenError(
        "Only organizer or admin can update participants."
      );
    }

    const participant = trip.participants.id(participantId);
    if (!participant) {
      throw new NotFoundError("Participant not found.");
    }

    if (status) participant.status = status;
    if (role) participant.role = role;

    await trip.save();

    res.status(200).json({
      statusCode: 200,
      data: participant,
      message: "Participant updated successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add milestones to a trip.
 * @route POST /api/trips/:id/milestones
 */
const addMilestone = async (req, res, next) => {
  try {
    const tripId = req.params.id;
    const { type, description, date, landmark } = req.body;
    const userId = req.user.id;

    const trip = await Trip.findById(tripId);
    if (!trip) throw new NotFoundError("Trip not found.");

    const organizer = trip.participants.find(
      (p) => p.userId.toString() === userId && p.role === "organizer"
    );
    if (!organizer && req.user.role !== "admin") {
      throw new ForbiddenError("Only organizer or admin can add milestones.");
    }

    trip.milestones.push({ type, description, date, landmark });
    await trip.save();

    res.status(200).json({
      statusCode: 200,
      data: trip.milestones,
      message: "Milestone added successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a milestone.
 * @route PUT /api/trips/:id/milestones/:milestoneId
 */
const updateMilestone = async (req, res, next) => {
  try {
    const tripId = req.params.id;
    const milestoneId = req.params.milestoneId;
    const { type, description, date, landmark } = req.body;
    const userId = req.user.id;

    const trip = await Trip.findById(tripId);
    if (!trip) throw new NotFoundError("Trip not found.");

    const organizer = trip.participants.find(
      (p) => p.userId.toString() === userId && p.role === "organizer"
    );
    if (!organizer && req.user.role !== "admin") {
      throw new ForbiddenError(
        "Only organizer or admin can update milestones."
      );
    }

    const milestone = trip.milestones.id(milestoneId);
    if (!milestone) throw new NotFoundError("Milestone not found.");

    if (type) milestone.type = type;
    if (description) milestone.description = description;
    if (date) milestone.date = date;
    if (landmark) milestone.landmark = landmark;

    await trip.save();

    res.status(200).json({
      statusCode: 200,
      data: milestone,
      message: "Milestone updated successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a milestone.
 * @route DELETE /api/trips/:id/milestones/:milestoneId
 */
const deleteMilestone = async (req, res, next) => {
  try {
    const tripId = req.params.id;
    const milestoneId = req.params.milestoneId;
    const userId = req.user.id;

    const trip = await Trip.findById(tripId);
    if (!trip) throw new NotFoundError("Trip not found.");

    const organizer = trip.participants.find(
      (p) => p.userId.toString() === userId && p.role === "organizer"
    );
    if (!organizer && req.user.role !== "admin") {
      throw new ForbiddenError(
        "Only organizer or admin can delete milestones."
      );
    }

    const milestone = trip.milestones.id(milestoneId);
    if (!milestone) throw new NotFoundError("Milestone not found.");

    milestone.remove();
    await trip.save();

    res.status(200).json({
      statusCode: 200,
      data: trip.milestones,
      message: "Milestone deleted successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add route waypoints to a trip.
 * @route POST /api/trips/:id/waypoints
 */
const addWaypoint = async (req, res, next) => {
  try {
    const tripId = req.params.id;
    const { coordinates } = req.body; // [lng, lat]
    const userId = req.user.id;

    const trip = await Trip.findById(tripId);
    if (!trip) throw new NotFoundError("Trip not found.");

    const organizer = trip.participants.find(
      (p) => p.userId.toString() === userId && p.role === "organizer"
    );
    if (!organizer && req.user.role !== "admin") {
      throw new ForbiddenError("Only organizer or admin can add waypoints.");
    }

    trip.routeWaypoints.push({ type: "Point", coordinates });
    await trip.save();

    res.status(200).json({
      statusCode: 200,
      data: trip.routeWaypoints,
      message: "Waypoint added successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a route waypoint by index.
 * @route DELETE /api/trips/:id/waypoints/:index
 */
const deleteWaypoint = async (req, res, next) => {
  try {
    const tripId = req.params.id;
    const index = parseInt(req.params.index);
    const userId = req.user.id;

    const trip = await Trip.findById(tripId);
    if (!trip) throw new NotFoundError("Trip not found.");

    const organizer = trip.participants.find(
      (p) => p.userId.toString() === userId && p.role === "organizer"
    );
    if (!organizer && req.user.role !== "admin") {
      throw new ForbiddenError("Only organizer or admin can delete waypoints.");
    }

    if (index < 0 || index >= trip.routeWaypoints.length) {
      throw new NotFoundError("Waypoint not found at the given index.");
    }

    trip.routeWaypoints.splice(index, 1);
    await trip.save();

    res.status(200).json({
      statusCode: 200,
      data: trip.routeWaypoints,
      message: "Waypoint deleted successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export {
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
};
