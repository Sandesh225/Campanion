// services/externalApiService.js
const axios = require("axios");
const config = require("../config/config");

const getWeather = async (location) => {
  const apiKey = config.OPENWEATHERMAP_API_KEY;
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    location
  )}&appid=${apiKey}&units=metric`;
  const response = await axios.get(url);
  return response.data;
};

const getFlights = async (origin, destination, date) => {
  const apiKey = config.SKYSCANNER_API_KEY;
  const url = `https://partners.api.skyscanner.net/apiservices/browseroutes/v1.0/US/USD/en-US/${origin}/${destination}/${date}?apiKey=${apiKey}`;
  const response = await axios.get(url);
  return response.data;
};

const getCurrencyRates = async (from, to) => {
  const apiKey = config.EXCHANGE_RATE_API_KEY;
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}`;
  const response = await axios.get(url);
  return response.data;
};

module.exports = {
  getWeather,
  getFlights,
  getCurrencyRates,
};
