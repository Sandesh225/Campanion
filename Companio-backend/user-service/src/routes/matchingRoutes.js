// src/routes/matchingRoutes.js
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  findUserMatchesByDestination,
  likeUser,
  getUserMatches,
  findUsersNearby,
  findUsersPassingThroughSameWaypoints,
  findUsersSameDestinationAndMode,
  findCulinaryContrastMatches,
  findComplementaryInterestsMatches,
  findTravelStyleMatches,
  findExactRouteMatches,
  findSameTravelModeMatches,
  findLanguageMatches,
  findCulinaryNicheMatches,
} from "../controllers/matchingController.js";

const router = express.Router();

// Apply authentication middleware
router.use(authMiddleware);

// Existing routes
router.get("/:userId", findUserMatchesByDestination);
router.post("/like", likeUser);
router.get("/:userId/matches", getUserMatches);
router.get("/nearby/:userId", findUsersNearby);
router.get("/waypoints/:userId", findUsersPassingThroughSameWaypoints);
router.get("/same-dest-mode/:userId", findUsersSameDestinationAndMode);

// New separate endpoints:
router.get("/culinary-contrast/:userId", findCulinaryContrastMatches);
router.get(
  "/complementary-interests/:userId",
  findComplementaryInterestsMatches
);
router.get("/travel-style/:userId", findTravelStyleMatches);
router.get("/exact-routes/:userId", findExactRouteMatches);
router.get("/travel-mode/:userId", findSameTravelModeMatches);
router.get("/language/:userId", findLanguageMatches);
router.get("/culinary-niche/:userId", findCulinaryNicheMatches);

export default router;
