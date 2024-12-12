// src/validations/tripValidation.js
import Joi from "joi";

export const createTripSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(""),
  origin: Joi.string().required(),
  destination: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  travelMode: Joi.string()
    .valid("flight", "train", "car", "bus", "boat", "other")
    .required(),
  destinationLocation: Joi.object({
    type: Joi.string().valid("Point").required(),
    coordinates: Joi.array()
      .items(Joi.number().required())
      .length(2)
      .required(), // Longitude and Latitude
  }).required(),
  budget: Joi.object({
    currency: Joi.string().valid("USD", "EUR", "GBP").default("USD"),
    amount: Joi.number().min(0).default(0),
  }).optional(),
  trip_details: Joi.object({
    description: Joi.string().allow(""),
    highlights: Joi.array().items(Joi.string()),
  }).optional(),
  preferences: Joi.object({
    preferred_activities: Joi.array().items(Joi.string()),
    dietary_restrictions: Joi.array().items(Joi.string()),
    language_preferences: Joi.array().items(Joi.string()),
  }).optional(),
});

export const updateTripSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string().allow(""),
  origin: Joi.string(),
  destination: Joi.string(),
  startDate: Joi.date(),
  endDate: Joi.date(),
  travelMode: Joi.string().valid(
    "flight",
    "train",
    "car",
    "bus",
    "boat",
    "other"
  ),
  budget: Joi.object({
    currency: Joi.string().valid("USD", "EUR", "GBP"),
    amount: Joi.number().min(0),
  }),
  trip_details: Joi.object({
    description: Joi.string(),
    highlights: Joi.array().items(Joi.string()),
  }),
  preferences: Joi.object({
    preferred_activities: Joi.array().items(Joi.string()),
    dietary_restrictions: Joi.array().items(Joi.string()),
    language_preferences: Joi.array().items(Joi.string()),
  }),
});

export const addParticipantsSchema = Joi.object({
  participants: Joi.array()
    .items(
      Joi.object({
        userId: Joi.string().required(), // Assuming userId is a string
        name: Joi.string().required(),
        email: Joi.string().email().required(),
      })
    )
    .required()
    .min(1) // Ensure at least one participant is provided
    .messages({
      "array.base": `"participants" should be an array`,
      "array.min": `"participants" must contain at least one participant`,
      "object.base": `"participants" must contain objects`,
      "any.required": `"participants" is required`,
    }),
});

export const milestoneSchema = Joi.object({
  type: Joi.string()
    .valid("flight", "accommodation", "activity", "other")
    .required(),
  description: Joi.string().required(),
  date: Joi.date().required(),
  landmark: Joi.string().optional(),
});

export const updateParticipantSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  status: Joi.string().valid("invited", "joined", "declined").optional(),
  role: Joi.string().valid("organizer", "member").optional(),
});

export const waypointSchema = Joi.object({
  type: Joi.string().valid("Point").required(),
  coordinates: Joi.array()
    .items(Joi.number().required())
    .length(2) // Longitude and latitude
    .required(),
});
