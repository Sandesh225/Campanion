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
    } = req.body;

    const userId = req.user.id;
    const username = req.user.username;
    const email = req.user.email;

    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
      throw new BadRequestError("Start date cannot be after the end date.");
    }

    // Create the trip
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
      ...(destination && { destination }),
      ...(is_active && { is_active: is_active === "true" }),
      ...(startDate &&
        endDate && {
          startDate: { $gte: new Date(startDate) },
          endDate: { $lte: new Date(endDate) },
        }),
    };

    const trips = await Trip.find(query)
      .select("-participants.email") // Exclude participant emails if not needed
      .lean();

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

    // Validate date updates if present
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
 * Delete a trip (soft delete).
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

export { createTrip, getUserTrips, getTripById, updateTrip, deleteTrip };
