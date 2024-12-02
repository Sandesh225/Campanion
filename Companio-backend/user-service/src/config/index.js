// src/config/index.js
import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  clientURL: process.env.CLIENT_URL,
  apiURL: process.env.API_URL,
  email: {
    service: process.env.EMAIL_SERVICE,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  externalAPIs: {
    openWeatherMap: process.env.OPENWEATHERMAP_API_KEY,
    googleMaps: process.env.GOOGLE_MAPS_API_KEY,
    skyscanner: process.env.SKYSCANNER_API_KEY,
  },
};

export default config;
