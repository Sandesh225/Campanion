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

// Existing routes
router.get("/:userId", authMiddleware, findUserMatchesByDestination);
router.post("/like", authMiddleware, likeUser);
router.get("/:userId/matches", authMiddleware, getUserMatches);
router.get("/nearby/:userId", authMiddleware, findUsersNearby);
router.get(
  "/waypoints/:userId",
  authMiddleware,
  findUsersPassingThroughSameWaypoints
);
router.get(
  "/same-dest-mode/:userId",
  authMiddleware,
  findUsersSameDestinationAndMode
);

// New separate endpoints:
router.get(
  "/culinary-contrast/:userId",
  authMiddleware,
  findCulinaryContrastMatches
);
router.get(
  "/complementary-interests/:userId",
  authMiddleware,
  findComplementaryInterestsMatches
);
router.get("/travel-style/:userId", authMiddleware, findTravelStyleMatches);
router.get("/exact-routes/:userId", authMiddleware, findExactRouteMatches);
router.get("/travel-mode/:userId", authMiddleware, findSameTravelModeMatches);
router.get("/language/:userId", authMiddleware, findLanguageMatches);
router.get("/culinary-niche/:userId", authMiddleware, findCulinaryNicheMatches);

export default router;
