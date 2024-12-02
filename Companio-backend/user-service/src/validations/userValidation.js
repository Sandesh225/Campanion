// src/validations/userValidation.js
import Joi from "joi";

export const updateProfileSchema = Joi.object({
  profile: Joi.object({
    fullName: Joi.string().max(100),
    location: Joi.string().required(),
    bio: Joi.string().max(500),
    currency: Joi.string().valid("USD", "EUR", "GBP"),

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
      .min(1),
    culinary: Joi.array().items(Joi.string()),
    interests: Joi.array().items(Joi.string()),
    activities: Joi.array().items(Joi.string()),
    languages: Joi.array().items(Joi.string()),
    badges: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        description: Joi.string().allow("", null),
        iconUrl: Joi.string().uri().allow("", null),
      })
    ),
  }),
  settings: Joi.object({
    privacy: Joi.object({
      profileVisibility: Joi.string().valid("public", "private"),
      searchVisibility: Joi.boolean(),
    }),
    notifications: Joi.object({
      emailNotifications: Joi.boolean(),
      pushNotifications: Joi.boolean(),
    }),
  }),
});

export const likeUserSchema = Joi.object({
  userId: Joi.string().required(),
  likedUserId: Joi.string().required(),
});

export const searchUsersSchema = Joi.object({
  travelStyle: Joi.string().valid(
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
  ),
  interests: Joi.string(), // Comma-separated
  languages: Joi.string(), // Comma-separated
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  username: Joi.string().min(3).max(30),
});
