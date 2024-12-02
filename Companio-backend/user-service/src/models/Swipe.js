// src/models/Swipe.js

import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * Swipe Schema to track user swipe actions.
 */
const swipeSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: ["like", "dislike", "superswipe"],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Ensure a user cannot swipe on the same target more than once
swipeSchema.index({ userId: 1, targetId: 1 }, { unique: true });

const Swipe = mongoose.model("Swipe", swipeSchema);

export { Swipe };
