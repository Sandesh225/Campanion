// src/controllers/matchingController.js
import { User } from "../models/User.js";
import Trip from "../models/Trip.js";
import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

/**
 * Utility Function: Get User's excluded IDs
 * Returns a set of userIds that should not be recommended again (already matched or liked).
 */
async function getExcludedUserIds(userId) {
  const user = await User.findById(userId).select("likes matches").lean();
  if (!user) return new Set();
  const excluded = new Set([
    ...user.likes.map((id) => id.toString()),
    ...user.matches.map((id) => id.toString()),
    userId.toString(), // exclude the user themselves
  ]);
  return excluded;
}

/**
 * Find users matching the given user's destination, excluding already matched/liked.
 * @route GET /api/matching/:userId
 */
export const findUserMatchesByDestination = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    logger.info(`Fetching user matches by destination for userId=${userId}`);

    const userTrips = await Trip.find({
      user: new mongoose.Types.ObjectId(userId),
    })
      .select("destination")
      .lean();

    if (!userTrips || userTrips.length === 0) {
      logger.info(`No trips found for userId=${userId}`);
      return res.status(404).json({
        statusCode: 404,
        data: null,
        message: "No trips found for this user.",
        errors: [],
        success: false,
      });
    }

    const destinations = [...new Set(userTrips.map((t) => t.destination))];
    const excluded = await getExcludedUserIds(userId);

    const matchingTrips = await Trip.aggregate([
      {
        $match: {
          destination: { $in: destinations },
          user: { $ne: new mongoose.Types.ObjectId(userId) },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $match: {
          "userDetails._id": {
            $nin: Array.from(excluded).map(
              (id) => new mongoose.Types.ObjectId(id)
            ),
          },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          origin: 1,
          destination: 1,
          startDate: 1,
          endDate: 1,
          travelMode: 1,
          "userDetails.username": 1,
          "userDetails.bio": 1,
          "userDetails.profilePicture": 1,
        },
      },
      { $skip: (page - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
    ]);

    logger.info(
      `Retrieved ${matchingTrips.length} matching trips for userId=${userId}`
    );

    res.status(200).json({
      statusCode: 200,
      data: matchingTrips,
      message: "Matching trips and users retrieved successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    logger.error(
      `Error fetching user matches by destination for userId=${req.params.userId}: ${error.message}`
    );
    next(error);
  }
};

/**
 * Like a user and check for mutual matches.
 * @route POST /api/matching/like
 */
export const likeUser = async (req, res, next) => {
  try {
    const { userId, likedUserId } = req.body;

    logger.info(`User ${userId} attempting to like user ${likedUserId}`);

    if (!userId || !likedUserId) {
      throw new BadRequestError("Both userId and likedUserId are required.");
    }

    if (userId === likedUserId) {
      throw new BadRequestError("You cannot like yourself.");
    }

    const [user, likedUser] = await Promise.all([
      User.findById(userId),
      User.findById(likedUserId),
    ]);

    if (!user || !likedUser) {
      throw new NotFoundError("User not found.");
    }

    if (user.likes.includes(likedUserId)) {
      throw new BadRequestError("User is already liked.");
    }

    user.likes.push(likedUserId);
    await user.save();

    let mutualMatch = false;

    if (likedUser.likes.includes(userId)) {
      mutualMatch = true;
      user.matches.push(likedUserId);
      likedUser.matches.push(userId);
      await Promise.all([user.save(), likedUser.save()]);
      logger.info(`Users ${userId} and ${likedUserId} are now a match.`);
    } else {
      logger.info(`User ${userId} liked user ${likedUserId} but no match yet.`);
    }

    res.status(200).json({
      statusCode: 200,
      data: { matched: mutualMatch },
      message: mutualMatch ? "It's a match!" : "User liked successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    logger.error(`Error liking user: ${error.message}`);
    next(error);
  }
};

/**
 * Fetch all matches for a user.
 * @route GET /api/matching/:userId/matches
 */
export const getUserMatches = async (req, res, next) => {
  try {
    const { userId } = req.params;
    logger.info(`Fetching matches for userId=${userId}`);

    const user = await User.findById(userId)
      .populate("matches", "-password -tokens")
      .lean();
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    logger.info(
      `Retrieved ${user.matches.length} matches for userId=${userId}`
    );

    res.status(200).json({
      statusCode: 200,
      data: user.matches,
      message: "Matches retrieved successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    logger.error(
      `Error fetching matches for userId=${req.params.userId}: ${error.message}`
    );
    next(error);
  }
};

/**
 * Match users currently at the same destination or within a certain radius using $geoNear.
 * @route GET /api/matching/nearby/:userId?radius=500
 */
export const findUsersNearby = async (req, res) => {
  try {
    const { userId } = req.params;
    const { radius = 500 } = req.query;

    logger.info(`Finding users near userId=${userId} within radius=${radius}m`);

    const user = await User.findById(userId);
    if (!user || !user.currentLocation) {
      logger.info(`User or location not found for userId=${userId}`);
      return res
        .status(404)
        .json({ message: "User or user location not found." });
    }

    // Use aggregation with $geoNear for more flexibility
    const results = await User.aggregate([
      {
        $geoNear: {
          near: user.currentLocation,
          distanceField: "dist.calculated",
          maxDistance: Number(radius),
          spherical: true,
          query: { _id: { $ne: user._id } }, // exclude current user
        },
      },
    ]);

    logger.info(`Found ${results.length} nearby users for userId=${userId}`);

    res.json({ nearbyUsers: results });
  } catch (error) {
    logger.error(`Error finding nearby users: ${error.message}`);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Match users passing through the same waypoints but with different destinations.
 * @route GET /api/matching/waypoints/:userId
 */
export const findUsersPassingThroughSameWaypoints = async (req, res) => {
  try {
    const { userId } = req.params;
    logger.info(
      `Finding users passing through same waypoints for userId=${userId}`
    );

    const userTrips = await Trip.find({ user: userId });
    if (!userTrips.length) {
      logger.info(`No trips found for userId=${userId}`);
      return res.status(404).json({ message: "No trips found for this user." });
    }

    const userWaypoints = userTrips.flatMap((t) => t.routeWaypoints);
    if (!userWaypoints.length) {
      logger.info(`No waypoints found for userId=${userId}`);
      return res.json({ matchedUsers: [] });
    }

    const firstWaypoint = userWaypoints[0];
    const excluded = await getExcludedUserIds(userId);

    const otherTrips = await Trip.find({
      user: { $ne: userId },
      routeWaypoints: {
        $geoIntersects: {
          $geometry: firstWaypoint,
        },
      },
    }).populate("user");

    const matchedUsers = [];
    const seen = new Set();
    for (const trip of otherTrips) {
      if (
        trip.user &&
        !excluded.has(trip.user._id.toString()) &&
        !seen.has(trip.user._id.toString())
      ) {
        matchedUsers.push(trip.user);
        seen.add(trip.user._id.toString());
      }
    }

    logger.info(
      `Found ${matchedUsers.length} users passing through same waypoints for userId=${userId}`
    );
    return res.json({ matchedUsers });
  } catch (error) {
    logger.error(
      `Error finding users passing through same waypoints: ${error.message}`
    );
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Match users traveling to the same destination using the same travelMode.
 * @route GET /api/matching/same-dest-mode/:userId
 */
export const findUsersSameDestinationAndMode = async (req, res) => {
  try {
    const { userId } = req.params;
    logger.info(
      `Finding users with same destination and mode for userId=${userId}`
    );

    const userTrips = await Trip.find({ user: userId });
    if (!userTrips.length) {
      logger.info(`No trips found for userId=${userId}`);
      return res.status(404).json({ message: "No trips found for this user." });
    }

    const firstTrip = userTrips[0];
    const { destination, travelMode } = firstTrip;
    const excluded = await getExcludedUserIds(userId);

    const matchingTrips = await Trip.find({
      user: { $ne: userId },
      destination,
      travelMode,
    }).populate("user");

    const matchedUsers = [];
    const seen = new Set();
    for (const trip of matchingTrips) {
      if (
        trip.user &&
        !excluded.has(trip.user._id.toString()) &&
        !seen.has(trip.user._id.toString())
      ) {
        matchedUsers.push(trip.user);
        seen.add(trip.user._id.toString());
      }
    }

    logger.info(
      `Found ${matchedUsers.length} users with same destination and mode for userId=${userId}`
    );
    return res.json({ matchedUsers });
  } catch (error) {
    logger.error(
      `Error finding users with same destination and mode: ${error.message}`
    );
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const findCulinaryContrastMatches = async (req, res, next) => {
  try {
    const { userId } = req.params;
    logger.info(`Finding culinary contrast matches for userId=${userId}`);

    // Fetch user
    const user = await User.findById(userId).select("profile").lean();
    if (!user) throw new NotFoundError("User not found.");

    const userCulinary = user.profile?.culinary || [];
    // Check if user is vegan
    const isVegan = userCulinary.includes("vegan");

    if (!isVegan) {
      // If user is not vegan, criterion doesn't apply
      return res.json({ matchedUsers: [] });
    }

    const excluded = await getExcludedUserIds(userId);

    // Find users who have "local meat" in culinary interests
    const matchedUsers = await User.find({
      _id: { $nin: Array.from(excluded) },
      "profile.culinary": { $in: ["local meat"] },
      "status.isActive": true,
      "settings.privacy.profileVisibility": "public",
    })
      .select("username profile profilePicture bio")
      .lean();

    logger.info(
      `Found ${matchedUsers.length} culinary contrast users for userId=${userId}`
    );
    return res.json({ matchedUsers });
  } catch (error) {
    logger.error(`Error finding culinary contrast matches: ${error.message}`);
    next(error);
  }
};

/**
 * Complementary Interests:
 * Example: A wildlife enthusiast matched with a photographer.
 * Endpoint: GET /api/matching/complementary-interests/:userId
 */
export const findComplementaryInterestsMatches = async (req, res, next) => {
  try {
    const { userId } = req.params;
    logger.info(`Finding complementary interests matches for userId=${userId}`);

    const user = await User.findById(userId).select("profile").lean();
    if (!user) throw new NotFoundError("User not found.");

    const userInterests = user.profile?.interests || [];
    const excluded = await getExcludedUserIds(userId);

    // Example: If user has "wildlife", we look for users who have "photography".
    let complementaryTarget = [];
    if (userInterests.includes("wildlife")) {
      complementaryTarget.push("photography");
    }
    if (userInterests.includes("photography")) {
      complementaryTarget.push("wildlife");
    }

    if (complementaryTarget.length === 0) {
      return res.json({ matchedUsers: [] });
    }

    const matchedUsers = await User.find({
      _id: { $nin: Array.from(excluded) },
      "profile.interests": { $in: complementaryTarget },
      "status.isActive": true,
      "settings.privacy.profileVisibility": "public",
    })
      .select("username profile profilePicture bio")
      .lean();

    logger.info(
      `Found ${matchedUsers.length} complementary interest users for userId=${userId}`
    );
    return res.json({ matchedUsers });
  } catch (error) {
    logger.error(
      `Error finding complementary interests matches: ${error.message}`
    );
    next(error);
  }
};

/**
 * Travel Style Compatibility:
 * Criteria: Same travel style (e.g. both are backpackers).
 * Endpoint: GET /api/matching/travel-style/:userId
 */
export const findTravelStyleMatches = async (req, res, next) => {
  try {
    const { userId } = req.params;
    logger.info(`Finding travel style matches for userId=${userId}`);

    const user = await User.findById(userId).select("profile").lean();
    if (!user) throw new NotFoundError("User not found.");

    const userStyles = user.profile?.travelStyles || [];
    if (userStyles.length === 0) {
      return res.json({ matchedUsers: [] });
    }

    const excluded = await getExcludedUserIds(userId);

    const matchedUsers = await User.find({
      _id: { $nin: Array.from(excluded) },
      "profile.travelStyles": { $in: userStyles },
      "status.isActive": true,
      "settings.privacy.profileVisibility": "public",
    })
      .select("username profile profilePicture bio")
      .lean();

    logger.info(
      `Found ${matchedUsers.length} travel style matches for userId=${userId}`
    );
    return res.json({ matchedUsers });
  } catch (error) {
    logger.error(`Error finding travel style matches: ${error.message}`);
    next(error);
  }
};

/**
 * Exact Travel Routes Match:
 * Match users with the same origin and destination in their trips.
 * Endpoint: GET /api/matching/exact-routes/:userId
 */
export const findExactRouteMatches = async (req, res, next) => {
  try {
    const { userId } = req.params;
    logger.info(`Finding exact route matches for userId=${userId}`);

    const userTrips = await Trip.find({ user: userId }).lean();
    if (!userTrips || userTrips.length === 0) {
      return res.json({ matchedUsers: [] });
    }

    const userOrigins = userTrips.map((t) => t.origin);
    const userDestinations = userTrips.map((t) => t.destination);

    const excluded = await getExcludedUserIds(userId);

    const matchingTrips = await Trip.aggregate([
      {
        $match: {
          user: { $ne: new mongoose.Types.ObjectId(userId) },
          origin: { $in: userOrigins },
          destination: { $in: userDestinations },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $match: {
          "userDetails._id": {
            $nin: Array.from(excluded).map(
              (id) => new mongoose.Types.ObjectId(id)
            ),
          },
        },
      },
      {
        $project: {
          "userDetails.username": 1,
          "userDetails.profile": 1,
          "userDetails.profilePicture": 1,
          "userDetails.bio": 1,
        },
      },
    ]);

    const matchedUsers = matchingTrips.map((t) => t.userDetails);
    logger.info(
      `Found ${matchedUsers.length} exact route matches for userId=${userId}`
    );
    return res.json({ matchedUsers });
  } catch (error) {
    logger.error(`Error finding exact route matches: ${error.message}`);
    next(error);
  }
};

/**
 * Same TravelMode:
 * Endpoint: GET /api/matching/travel-mode/:userId
 */
export const findSameTravelModeMatches = async (req, res, next) => {
  try {
    const { userId } = req.params;
    logger.info(`Finding same travel mode matches for userId=${userId}`);

    const userTrips = await Trip.find({ user: userId }).lean();
    if (!userTrips.length) return res.json({ matchedUsers: [] });

    const userModes = [...new Set(userTrips.map((t) => t.travelMode))];
    if (userModes.length === 0) return res.json({ matchedUsers: [] });

    const excluded = await getExcludedUserIds(userId);

    const matchingTrips = await Trip.aggregate([
      {
        $match: {
          travelMode: { $in: userModes },
          user: { $ne: new mongoose.Types.ObjectId(userId) },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $match: {
          "userDetails._id": {
            $nin: Array.from(excluded).map(
              (id) => new mongoose.Types.ObjectId(id)
            ),
          },
        },
      },
      {
        $project: {
          "userDetails.username": 1,
          "userDetails.profile": 1,
          "userDetails.profilePicture": 1,
          "userDetails.bio": 1,
        },
      },
    ]);

    const matchedUsers = matchingTrips.map((t) => t.userDetails);
    logger.info(
      `Found ${matchedUsers.length} same travel mode matches for userId=${userId}`
    );
    return res.json({ matchedUsers });
  } catch (error) {
    logger.error(`Error finding same travel mode matches: ${error.message}`);
    next(error);
  }
};

/**
 * Language Compatibility:
 * If users share at least one language.
 * Endpoint: GET /api/matching/language/:userId
 */
export const findLanguageMatches = async (req, res, next) => {
  try {
    const { userId } = req.params;
    logger.info(`Finding language matches for userId=${userId}`);

    const user = await User.findById(userId).select("profile.languages").lean();
    if (!user) throw new NotFoundError("User not found.");

    const userLangs = user.profile?.languages || [];
    if (userLangs.length === 0) return res.json({ matchedUsers: [] });

    const excluded = await getExcludedUserIds(userId);

    const matchedUsers = await User.find({
      _id: { $nin: Array.from(excluded) },
      "profile.languages": { $in: userLangs },
      "status.isActive": true,
      "settings.privacy.profileVisibility": "public",
    })
      .select("username profile profilePicture bio")
      .lean();

    logger.info(
      `Found ${matchedUsers.length} language matches for userId=${userId}`
    );
    return res.json({ matchedUsers });
  } catch (error) {
    logger.error(`Error finding language matches: ${error.message}`);
    next(error);
  }
};

/**
 * Uncommon Culinary Matches (Niche)
 * E.g., both users enjoy "insect cuisine" or "fermented foods".
 * Endpoint: GET /api/matching/culinary-niche/:userId
 */
export const findCulinaryNicheMatches = async (req, res, next) => {
  try {
    const { userId } = req.params;
    logger.info(`Finding culinary niche matches for userId=${userId}`);

    const user = await User.findById(userId).select("profile.culinary").lean();
    if (!user) throw new NotFoundError("User not found.");

    const userCulinary = user.profile?.culinary || [];
    // Identify niche interests
    const nicheInterests = [
      "insect cuisine",
      "fermented foods",
      "exotic spices",
    ];
    const userNiche = userCulinary.filter((c) => nicheInterests.includes(c));

    if (userNiche.length === 0) {
      return res.json({ matchedUsers: [] });
    }

    const excluded = await getExcludedUserIds(userId);

    const matchedUsers = await User.find({
      _id: { $nin: Array.from(excluded) },
      "profile.culinary": { $in: userNiche },
      "status.isActive": true,
      "settings.privacy.profileVisibility": "public",
    })
      .select("username profile profilePicture bio")
      .lean();

    logger.info(
      `Found ${matchedUsers.length} culinary niche matches for userId=${userId}`
    );
    return res.json({ matchedUsers });
  } catch (error) {
    logger.error(`Error finding culinary niche matches: ${error.message}`);
    next(error);
  }
};
