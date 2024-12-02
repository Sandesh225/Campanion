// src/services/airplaneService.js
import axios from "axios";
import config from "../config/index.js";

export const getRealTimeFlightData = async (flightNumber) => {
  const url = `https://flightaware.com/api/flight/${flightNumber}?apikey=${config.flightAwareApiKey}`;
  const response = await axios.get(url);
  return response.data;
};
