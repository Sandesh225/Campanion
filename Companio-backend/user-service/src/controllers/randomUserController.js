import mongoose from "mongoose";
import { User } from "../models/User.js";
import { ForbiddenError, InternalServerError } from "../utils/ApiError.js";

const getRandomUsers = async (req, res, next) => {
  try {
    // Ensure the requester is authenticated
    if (!req.user) {
      throw new ForbiddenError("Access denied");
    }

    const currentUserId = req.user.id;

    // Convert currentUserId to ObjectId
    const currentUserObjectId = new mongoose.Types.ObjectId(currentUserId);

    // Define the number of random users to retrieve
    const sampleSize = 25;

    // Fetch random users excluding the current user
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: currentUserObjectId },
          "status.isActive": true,
          "settings.privacy.profileVisibility": "public",
        },
      },
      { $sample: { size: sampleSize } },
      {
        $project: {
          username: 1,
          "profile.profilePictureUrl": 1,
          "profile.bio": 1,
          "profile.preferences": 1,
          "profile.interests": 1,
        },
      },
    ]);

    // Respond with the list of random users
    res.status(200).json({
      statusCode: 200,
      data: users,
      message: "Random users retrieved successfully",
      errors: [],
      success: true,
    });
  } catch (error) {
    console.error("Error fetching random users:", error);
    next(new InternalServerError("Failed to retrieve random users"));
  }
};

export {
  getRandomUsers, // Export the new function
};
