// src/models/Match.js
import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * Match Schema to store mutual matches between users.
 */
const matchSchema = new Schema(
  {
    user1Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user2Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    matchTimestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Ensure the combination of user1Id and user2Id is unique, regardless of order
matchSchema.index(
  { user1Id: 1, user2Id: 1 },
  {
    unique: true,
    partialFilterExpression: {
      user1Id: { $exists: true },
      user2Id: { $exists: true },
    },
  }
);

const Match = mongoose.model("Match", matchSchema);

export { Match };
