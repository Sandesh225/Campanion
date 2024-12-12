// src/controllers/swipeController.js
import { io, userSocketMap } from "../../server.js";
import { BadRequestError, NotFoundError } from "../utils/ApiError.js";
import { Swipe } from "../models/Swipe.js";
import { Match } from "../models/Match.js";
import { User } from "../models/User.js";

/**
 * Handle user swipe actions and check for mutual matches.
 * @route POST /api/swipe
 */
const handleSwipe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { targetId, action } = req.body;

    // Validate action
    if (!["like", "dislike", "superswipe"].includes(action)) {
      throw new BadRequestError("Invalid swipe action.");
    }

    // Prevent users from swiping on themselves
    if (userId === targetId) {
      throw new BadRequestError("You cannot swipe on yourself.");
    }

    // Check if the swipe already exists
    const existingSwipe = await Swipe.findOne({ userId, targetId });
    if (existingSwipe) {
      throw new BadRequestError("You have already swiped on this user.");
    }

    // Record the swipe
    const swipe = new Swipe({ userId, targetId, action });
    await swipe.save();

    // Check for mutual match
    if (action === "like" || action === "superswipe") {
      const reciprocalSwipe = await Swipe.findOne({
        userId: targetId,
        targetId: userId,
        action: { $in: ["like", "superswipe"] },
      });

      if (reciprocalSwipe) {
        // Create a match if it doesn't exist
        const existingMatch = await Match.findOne({
          $or: [
            { user1Id: userId, user2Id: targetId },
            { user1Id: targetId, user2Id: userId },
          ],
        });

        if (!existingMatch) {
          const match = new Match({ user1Id: userId, user2Id: targetId });
          await match.save();

          // Fetch user details for notifications
          const [user1, user2] = await Promise.all([
            User.findById(userId).select("username profilePicture"),
            User.findById(targetId).select("username profilePicture"),
          ]);

          // Notification payloads
          const notificationToUser1 = {
            matchedProfileId: user2._id,
            matchedProfileName: user2.username,
            matchedProfilePhotoUrl: user2.profilePicture,
          };

          const notificationToUser2 = {
            matchedProfileId: user1._id,
            matchedProfileName: user1.username,
            matchedProfilePhotoUrl: user1.profilePicture,
          };

          // Send real-time notifications via Socket.IO
          const user1SocketId = userSocketMap.get(userId);
          if (user1SocketId) {
            io.to(user1SocketId).emit("new-match", notificationToUser1);
          }

          const user2SocketId = userSocketMap.get(targetId);
          if (user2SocketId) {
            io.to(user2SocketId).emit("new-match", notificationToUser2);
          }
        }
      }
    }

    res.status(201).json({
      statusCode: 201,
      data: null,
      message: "Swipe action recorded successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export { handleSwipe };
