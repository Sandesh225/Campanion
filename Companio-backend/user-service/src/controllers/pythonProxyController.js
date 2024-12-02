import axios from "axios";
import config from "./../config/index";

const pythonBaseUrl = config.PYTHON_BACKEND_URL; // e.g., 'http://localhost:5000/api'

const proxyRecommendation = async (req, res, next) => {
  try {
    const response = await axios.get(`${pythonBaseUrl}/recommendations`, {
      params: req.query,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
};

const proxyLandmarks = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query;
    const response = await axios.get(`${pythonBaseUrl}/landmarks`, {
      params: { latitude, longitude },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
};

// Similarly, implement proxy functions for other Python endpoints

export {
  proxyRecommendation,
  proxyLandmarks,
  // Add other proxy functions
};
