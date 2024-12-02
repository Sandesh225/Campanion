// src/services/skyscannerService.js
import axios from "axios";
import config from "../config/index.js";

export const searchFlights = async (
  origin,
  destination,
  departureDate,
  returnDate
) => {
  const url = `https://partners.api.skyscanner.net/apiservices/browseroutes/v1.0/US/USD/en-US/${origin}/${destination}/${departureDate}?apiKey=${config.skyscannerApiKey}`;
  const response = await axios.get(url);
  return response.data;
};
