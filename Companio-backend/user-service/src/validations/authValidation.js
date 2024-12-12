// src/validations/authValidation.js
import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must include one uppercase, one lowercase, one digit, and one special character.",
    }),
  profile: Joi.object({
    fullName: Joi.string().max(100),
    bio: Joi.string().max(500),
    currency: Joi.string().valid("USD", "EUR", "GBP").default("USD"),
    preferences: Joi.object({
      travelStyles: Joi.array()
        .items(
          Joi.string().valid(
            "Solo Traveler",
            "Family Traveler",
            "Backpacker",
            "Luxury Traveler",
            "Adventure Traveler",
            "Business Traveler",
            "Digital Nomad",
            "Road Tripper",
            "Eco Traveler",
            "Cultural Explorer",
            "Wellness Traveler",
            "Beach Lover",
            "Mountain Explorer",
            "Cruise Traveler",
            "Budget Traveler",
            "Group Traveler",
            "Glamping Traveler"
          )
        )
        .default(["Solo Traveler"]),
      culinary: Joi.array().items(Joi.string()).default([]),
      interests: Joi.array().items(Joi.string()).default([]),
      activities: Joi.array().items(Joi.string()).default([]),
      languages: Joi.array().items(Joi.string()).default([]),
    }).default(),
  }).default(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    "any.required": '"refreshToken" is required',
    "string.base": '"refreshToken" should be a string',
  }),
});

export const logoutSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

// Validation Schemas for Password Reset
export const requestPasswordResetSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(new RegExp("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must include one uppercase, one lowercase, one digit, and one special character.",
    }),
});
