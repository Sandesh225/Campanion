// src/models/Landmark.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const landmarkSchema = new Schema({
  name: { type: String, required: true, unique: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  description: { type: String, default: "" },
  funFacts: { type: [String], default: [] },
  category: {
    type: String,
    enum: ["historical", "natural", "cultural"],
    required: true,
  },
});

const Landmark = mongoose.model("Landmark", landmarkSchema);

export { Landmark };
