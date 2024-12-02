// src/services/weatherService.js
import axios from "axios";
import config from "../config/index.js";

export const getWeatherByLocation = async (latitude, longitude) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${config.openWeatherMapApiKey}&units=metric`;
  const response = await axios.get(url);
  return response.data;
};
