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
