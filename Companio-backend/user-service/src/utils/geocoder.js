// src/utils/geocoder.js
import axios from "axios";
import config from "../config/index.js";

const getCoordinates = async (location) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    location
  )}.json?access_token=${config.mapboxApiKey}`;
  const response = await axios.get(url);
  if (response.data.features.length === 0) {
    throw new Error("Location not found.");
  }
  const [longitude, latitude] = response.data.features[0].center;
  return { latitude, longitude };
};

export default { getCoordinates };
