// src/controllers/landmarkController.js (Updated)
import { getCache, setCache } from "../services/cacheService.js";

export const getLandmarks = async (req, res, next) => {
  try {
    const cacheKey = "all_landmarks";
    const cachedLandmarks = await getCache(cacheKey);
    if (cachedLandmarks) {
      return res.json({ landmarks: JSON.parse(cachedLandmarks) });
    }

    const landmarks = await Landmark.find({});
    await setCache(cacheKey, JSON.stringify(landmarks));
    res.json({ landmarks });
  } catch (error) {
    next(error);
  }
};
