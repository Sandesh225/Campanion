// src/controllers/themeController.js
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from "../utils/ApiError.js";
import { User } from "../models/User.js";

/**
 * Get the current user's theme preference.
 * @route GET /api/theme
 * @access Private
 */
const getThemePreference = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("settings.themePreference");
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    res.status(200).json({
      statusCode: 200,
      data: {
        themePreference: user.settings.themePreference,
      },
      message: "Theme preference retrieved successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Set the current user's theme preference.
 * @route PUT /api/theme
 * @access Private
 */
const setThemePreference = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { themePreference } = req.body;

    if (!themePreference || !["light", "dark"].includes(themePreference)) {
      throw new BadRequestError(
        "Invalid theme preference. Choose 'light' or 'dark'."
      );
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { "settings.themePreference": themePreference },
      { new: true, runValidators: true }
    ).select("settings.themePreference");

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    res.status(200).json({
      statusCode: 200,
      data: {
        themePreference: user.settings.themePreference,
      },
      message: "Theme preference updated successfully.",
      errors: [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export { getThemePreference, setThemePreference };
