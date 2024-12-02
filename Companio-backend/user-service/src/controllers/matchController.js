// src/controllers/matchController.js

import { Match } from "../models/Match.js";
import { User } from "../models/User.js";

/**
 * Retrieve the list of matches for the logged-in user.
 * @route GET /api/matches
 */
const getMatches = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find matches where the user is involved
    const matches = await Match.find({
      $or: [{ user1Id: userId }, { user2Id: userId }],
    }).sort({ matchTimestamp: -1 });

    // Populate matched user details
    const matchedUsers = await Promise.all(
      matches.map(async (match) => {
        const matchedUserId =
          match.user1Id.toString() === userId ? match.user2Id : match.user1Id;

        const user = await User.findById(matchedUserId).select(
          "username profile.profilePictureUrl"
        );

        return {
          matchedProfileId: user._id,
          matchedProfileName: user.username,
          matchedProfilePhotoUrl: user.profile.profilePictureUrl,
          matchTimestamp: match.matchTimestamp,
        };
      })
    );

    res.status(200).json({
      statusCode: 200,
      data: matchedUsers,
      message: "Matches retrieved successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export { getMatches };
