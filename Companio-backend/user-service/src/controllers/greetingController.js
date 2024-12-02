// src/controllers/greetingController.js
import { User } from "../models/User.js";
import axios from "axios";
import config from "../config/index.js";

export const getGreeting = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    // Fetch user location using geolocation API
    const locationResponse = await axios.get(`https://ipapi.co/json/`);
    const location = locationResponse.data;

    // Customize greeting based on time and location
    const currentHour = new Date().getHours();
    let greeting = "Hello";

    if (currentHour < 12) greeting = "Good Morning";
    else if (currentHour < 18) greeting = "Good Afternoon";
    else greeting = "Good Evening";

    greeting += `, ${user.username}! Welcome to your personalized travel companion.`;

    res.json({ greeting, location });
  } catch (error) {
    next(error);
  }
};
