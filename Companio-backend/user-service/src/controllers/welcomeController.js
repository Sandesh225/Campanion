// src/controllers/welcomeController.js
import geocoder from "../utils/geocoder.js";
import { Landmark } from "../models/Landmark.js";

export const getWelcomeData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const location = await geocoder.getCoordinates(user.currentLocation); // Assume currentLocation field

    const nearbyLandmarks = await Landmark.find({
      "location.latitude": {
        $gte: location.latitude - 1,
        $lte: location.latitude + 1,
      },
      "location.longitude": {
        $gte: location.longitude - 1,
        $lte: location.longitude + 1,
      },
    }).limit(5);

    res.json({ location, nearbyLandmarks });
  } catch (error) {
    next(error);
  }
};
