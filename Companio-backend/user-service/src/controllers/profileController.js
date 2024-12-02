// src/controllers/profileController.js

import { User } from "../models/User.js";
import { Swipe } from "../models/Swipe.js";

/**
 * Fetch profiles based on user preferences and exclude already swiped profiles.
 * @route GET /api/profiles
 */
const getProfiles = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, location, age, interests } = req.query;

    // Convert pagination parameters to integers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Get list of user IDs already swiped on
    const swipedProfiles = await Swipe.find({ userId }).select("targetId");
    const swipedIds = swipedProfiles.map((swipe) => swipe.targetId);

    // Build aggregation pipeline
    const pipeline = [];

    // Match stage
    const matchStage = {
      $match: {
        _id: { $ne: userId, $nin: swipedIds },
        "status.isActive": true,
        "status.isVerified": true,
      },
    };

    // Apply filters
    if (location) {
      matchStage.$match["profile.location"] = location;
    }
    if (age) {
      matchStage.$match["profile.age"] = parseInt(age);
    }
    if (interests) {
      const interestsArray = interests.split(",");
      matchStage.$match["profile.interests"] = { $in: interestsArray };
    }

    pipeline.push(matchStage);

    // Pagination stages
    pipeline.push(
      { $skip: (pageNumber - 1) * limitNumber },
      { $limit: limitNumber }
    );

    // Project necessary fields
    pipeline.push({
      $project: {
        username: 1,
        "profile.profilePictureUrl": 1,
        "profile.location": 1,
        "profile.age": 1,
        "profile.interests": 1,
      },
    });

    // Execute aggregation
    const profiles = await User.aggregate(pipeline);

    res.status(200).json({
      statusCode: 200,
      data: profiles,
      message: "Profiles fetched successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export { getProfiles };
