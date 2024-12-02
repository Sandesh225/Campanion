// src/models/Trip.js
import mongoose from "mongoose";

const { Schema } = mongoose;

// Define sub-schemas
const milestoneSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ["flight", "accommodation", "activity", "other"],
  }, // e.g., flight, accommodation
  description: { type: String, required: true },
  date: { type: Date, required: true },
  landmark: { type: mongoose.Schema.Types.ObjectId, ref: "Landmark" }, // Optional
});

const participantSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Reference to a User model
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ["invited", "joined", "declined"],
      default: "invited",
    },
    role: {
      type: String,
      enum: ["organizer", "member"],
      default: "member",
    },
    joined_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Main Trip Schema
const tripSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    origin: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    travelMode: {
      type: String,
      required: true,
      enum: ["flight", "train", "car", "bus", "boat", "other"],
    },
    budget: {
      currency: { type: String, default: "USD" },
      amount: { type: Number, default: 0 },
    },
    trip_details: {
      description: { type: String, default: "" }, // Additional trip info
      highlights: [{ type: String }], // Key attractions or goals
    },
    preferences: {
      preferred_activities: [{ type: String }], // e.g., "hiking", "sightseeing"
      dietary_restrictions: [{ type: String }], // e.g., "vegan", "kosher"
      language_preferences: [{ type: String }], // Languages for communication
    },
    is_active: { type: Boolean, default: true },
    milestones: [milestoneSchema],
    participants: [participantSchema],
  },
  { timestamps: true }
);

// Indexing for performance
tripSchema.index({ user: 1, startDate: -1 });
tripSchema.index({ destination: 1 });

// Export Trip model
const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
