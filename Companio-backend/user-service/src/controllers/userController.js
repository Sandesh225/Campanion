// src/controllers/userController.js
import {
  ForbiddenError,
  NotFoundError,
  BadRequestError,
} from "../utils/ApiError.js";
import { User } from "../models/User.js";
import { cloudinary } from "../utils/cloudinary.js";
import streamifier from "streamifier";

/**
 * Retrieve user profile.
 * @route GET /api/users/:id
 */
const getProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Ensure user is requesting their own profile or has admin permissions
    if (req.user.id !== userId && req.user.role !== "admin") {
      throw new ForbiddenError("Access denied");
    }

    const user = await User.findById(userId).select("-password -tokens").lean();
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Respond with user profile
    res.status(200).json({
      statusCode: 200,
      data: user,
      message: "User profile retrieved successfully",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile.
 * @route PUT /api/users/:id
 */
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    // Ensure user is updating their own profile or has admin permissions
    if (req.user.id !== userId && req.user.role !== "admin") {
      throw new ForbiddenError("Access denied");
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    )
      .select("-password -tokens")
      .lean();

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Respond with updated profile
    res.status(200).json({
      statusCode: 200,
      data: user,
      message: "User profile updated successfully",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user account.
 * @route DELETE /api/users/:id
 */
const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Ensure user is deleting their own account or has admin permissions
    if (req.user.id !== userId && req.user.role !== "admin") {
      throw new ForbiddenError("Access denied");
    }

    const user = await User.findByIdAndDelete(userId).lean();

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Optionally, perform additional cleanup (e.g., delete trips, likes, matches)

    // Respond with success message
    res.status(200).json({
      statusCode: 200,
      data: null,
      message: "User account deleted successfully",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search or list users based on criteria.
 * @route GET /api/users
 */
const searchUsers = async (req, res, next) => {
  try {
    const {
      travelStyle,
      interests,
      languages,
      page = 1,
      limit = 20,
      username,
    } = req.query;

    const pageNumber = parseInt(page) > 0 ? parseInt(page) : 1;
    const limitNumber = parseInt(limit) > 0 ? parseInt(limit) : 20;

    const query = {
      "status.isActive": true,
      "settings.privacy.profileVisibility": "public",
    };

    if (travelStyle) query["profile.travelStyles"] = travelStyle;
    if (interests) query["profile.interests"] = { $in: interests.split(",") };
    if (languages) query["profile.languages"] = { $in: languages.split(",") };
    if (username) query["username"] = { $regex: username, $options: "i" };

    const users = await User.find(query)
      .select("-password -tokens")
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .lean();

    // Respond with list of users
    res.status(200).json({
      statusCode: 200,
      data: users,
      message: "Users retrieved successfully",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload profile picture.
 * @route POST /api/users/:id/profile/picture
 */
const uploadProfilePicture = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Ensure user is uploading their own picture or has admin permissions
    if (req.user.id !== userId && req.user.role !== "admin") {
      throw new ForbiddenError("Access denied");
    }

    if (!req.file) {
      throw new BadRequestError("No file uploaded");
    }

    // Upload to Cloudinary
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "profile_pictures",
            resource_type: "image",
            public_id: `profile_${userId}_${Date.now()}`, // Unique filename
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    // Update user's profilePicture
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: result.secure_url },
      { new: true }
    )
      .select("-password -tokens")
      .lean();

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Respond with updated profile picture URL
    res.status(200).json({
      statusCode: 200,
      data: { profilePictureUrl: user.profilePicture },
      message: "Profile picture updated successfully",
      errors: [],
      success: true,
    });
  } catch (error) {
    // Handle Cloudinary-specific errors
    if (error.name === "MulterError") {
      return next(new BadRequestError(error.message));
    }
    next(error);
  }
};

/**
 * Complete user profile.
 * @route POST /api/users/:id/complete-profile
 */
const completeProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { profile } = req.body;

    // Ensure user is completing their own profile or has admin permissions
    if (req.user.id !== userId && req.user.role !== "admin") {
      throw new ForbiddenError("Access denied");
    }

    // Validate badges if provided
    if (profile.badges && Array.isArray(profile.badges)) {
      for (const badge of profile.badges) {
        if (!badge.name) {
          throw new BadRequestError("Each badge must have a name.");
        }
      }
    }

    // Update user profile
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { profile } },
      { new: true, runValidators: true }
    )
      .select("-password -tokens")
      .lean();

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.status(200).json({
      statusCode: 200,
      data: user,
      message: "Profile completed successfully",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get matched users based on mutual likes.
 * @route GET /api/users/matchmaking
 */
const getMatches = async (req, res, next) => {
  try {
    const { userId, interests, activities, page = 1, limit = 20 } = req.query;

    // Validate userId
    if (!userId) {
      throw new BadRequestError("userId is required");
    }

    // Ensure the requesting user matches the userId or is an admin
    if (req.user.id !== userId && req.user.role !== "admin") {
      throw new ForbiddenError("Access denied");
    }

    const pageNumber = parseInt(page) > 0 ? parseInt(page) : 1;
    const limitNumber = parseInt(limit) > 0 ? parseInt(limit) : 20;

    // Fetch matches based on interests and activities
    const matches = await User.find({
      _id: { $ne: userId }, // Exclude current user
      ...(interests && { "profile.interests": { $in: interests.split(",") } }),
      ...(activities && {
        "profile.activities": { $in: activities.split(",") },
      }),
      "status.isActive": true,
      "status.isVerified": true,
      matches: userId, // Ensure mutual like
    })
      .select("-password -tokens")
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .lean();

    res.status(200).json({
      statusCode: 200,
      data: matches,
      message: "Matches fetched successfully",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Like a user.
 * @route POST /api/users/like
 */
const likeUser = async (req, res, next) => {
  try {
    const { userId, likedUserId } = req.body;

    // Validate input
    if (!userId || !likedUserId) {
      throw new BadRequestError("userId and likedUserId are required");
    }

    // Ensure users are not liking themselves
    if (userId === likedUserId) {
      throw new BadRequestError("You cannot like yourself");
    }

    // Find both users
    const user = await User.findById(userId);
    const likedUser = await User.findById(likedUserId);

    if (!user || !likedUser) {
      throw new NotFoundError("User not found");
    }

    // Check if already liked
    if (user.likes.includes(likedUserId)) {
      throw new BadRequestError("You have already liked this user");
    }

    // Add to likes
    user.likes.push(likedUserId);
    await user.save();

    // Check if mutual like
    if (likedUser.likes.includes(userId)) {
      // Create a match
      user.matches.push(likedUserId);
      likedUser.matches.push(userId);
      await user.save();
      await likedUser.save();

      return res.status(200).json({
        statusCode: 200,
        data: { matched: true },
        message: "It's a match!",
        errors: [],
        success: true,
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: { matched: false },
      message: "User liked successfully",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user badges.
 * @route GET /api/users/badges
 */
const getBadges = async (req, res, next) => {
  try {
    const { userId } = req.query;

    // Validate userId
    if (!userId) {
      throw new BadRequestError("userId is required");
    }

    // Ensure the requesting user matches the userId or is an admin
    if (req.user.id !== userId && req.user.role !== "admin") {
      throw new ForbiddenError("Access denied");
    }

    // Fetch user to get badges
    const user = await User.findById(userId).select("badges").lean();
    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.status(200).json({
      statusCode: 200,
      data: user.badges,
      message: "Badges fetched successfully",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload travel photo.
 * @route POST /api/users/:id/travel-photos
 */
const uploadTravelPhoto = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Ensure user is uploading their own photos or has admin permissions
    if (req.user.id !== userId && req.user.role !== "admin") {
      throw new ForbiddenError("Access denied");
    }

    if (!req.file) {
      throw new BadRequestError("No file uploaded");
    }

    // Upload to Cloudinary
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "travel_photos",
            resource_type: "image",
            public_id: `travel_${userId}_${Date.now()}`,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    // Update user's travelPhotos
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.travelPhotos.length >= 8) {
      throw new BadRequestError("Maximum of 8 photos allowed");
    }

    user.travelPhotos.push(result.secure_url);
    await user.save();

    res.status(200).json({
      statusCode: 200,
      data: { travelPhotos: user.travelPhotos },
      message: "Travel photo uploaded successfully",
      errors: [],
      success: true,
    });
  } catch (error) {
    // Handle Cloudinary-specific errors
    if (error.name === "MulterError") {
      return next(new BadRequestError(error.message));
    }
    next(error);
  }
};

/**
 * Delete travel photo.
 * @route DELETE /api/users/:id/travel-photos
 */
const deleteTravelPhoto = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { photoUrl } = req.body;

    if (!photoUrl) {
      throw new BadRequestError("Photo URL is required");
    }

    // Ensure user is deleting their own photos or has admin permissions
    if (req.user.id !== userId && req.user.role !== "admin") {
      throw new ForbiddenError("Access denied");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const photoIndex = user.travelPhotos.indexOf(photoUrl);
    if (photoIndex === -1) {
      throw new NotFoundError("Photo not found in user's travel photos");
    }

    user.travelPhotos.splice(photoIndex, 1);
    await user.save();

    // Optionally, delete the image from Cloudinary
    // Extract public_id from photoUrl
    const publicId = photoUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`travel_photos/${publicId}`);

    res.status(200).json({
      statusCode: 200,
      data: { travelPhotos: user.travelPhotos },
      message: "Travel photo deleted successfully",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getProfile,
  updateProfile,
  deleteAccount,
  searchUsers,
  uploadProfilePicture,
  completeProfile,
  getMatches,
  getBadges,
  likeUser,
  uploadTravelPhoto,
  deleteTravelPhoto,
};
