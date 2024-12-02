// src/controllers/flightController.js
import { searchFlights } from "../services/skyscannerService.js";

export const findFlights = async (req, res, next) => {
  try {
    const { origin, destination, departureDate, returnDate } = req.query;
    const flights = await searchFlights(
      origin,
      destination,
      departureDate,
      returnDate
    );
    res.json({ flights });
  } catch (error) {
    next(error);
  }
};
