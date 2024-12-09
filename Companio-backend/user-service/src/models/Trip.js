// src/models/Trip.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const milestoneSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ["flight", "accommodation", "activity", "other"],
  },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  landmark: { type: mongoose.Schema.Types.ObjectId, ref: "Landmark" },
});

const participantSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
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
    joined_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Location schema for waypoints
const waypointSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  { _id: false }
);

const tripSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    origin: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
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
      description: { type: String, default: "" },
      highlights: [{ type: String }],
    },
    preferences: {
      preferred_activities: [{ type: String }],
      dietary_restrictions: [{ type: String }],
      language_preferences: [{ type: String }],
    },
    is_active: { type: Boolean, default: true },
    milestones: [milestoneSchema],
    participants: [participantSchema],

    // Store route waypoints
    routeWaypoints: {
      type: [waypointSchema],
      default: [],
    },

    // Destination coordinates for geospatial queries
    destinationLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
  },
  { timestamps: true }
);

tripSchema.index({ user: 1, startDate: -1 });
tripSchema.index({ destination: 1 });
tripSchema.index({ routeWaypoints: "2dsphere" });
tripSchema.index({ destinationLocation: "2dsphere" });

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
