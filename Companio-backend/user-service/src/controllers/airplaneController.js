// src/controllers/airplaneController.js
import { getRealTimeFlightData } from "../services/airplaneService.js";

export const trackFlight = async (req, res, next) => {
  try {
    const { flightNumber } = req.params;
    const flightData = await getRealTimeFlightData(flightNumber);
    res.json({ flightData });
  } catch (error) {
    next(error);
  }
};
