// src/routes/userRoutes.js
import express from "express";
import {
  getProfile,
  updateProfile,
  deleteAccount,
  searchUsers,
  uploadProfilePicture,
  completeProfile,
  getMatches,
  getBadges,
  likeUser,
  uploadTravelPhoto,
  deleteTravelPhoto,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorize.js";
import validateRequest from "../middlewares/validateRequest.js";
import {
  updateProfileSchema,
  searchUsersSchema,
  likeUserSchema,
} from "../validations/userValidation.js";
import multer from "multer";
import { BadRequestError } from "../utils/ApiError.js";

// Initialize router
const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestError("Only JPEG, PNG, or WebP images are allowed"));
    }
  },
});

// Apply authentication middleware to all routes below
router.use(authMiddleware);

// **Define Specific Routes First**
// @route   GET /api/users/matchmaking
router.get("/matchmaking", getMatches);

// @route   GET /api/users/badges
router.get("/badges", getBadges);

// @route   POST /api/users/like
router.post("/like", validateRequest(likeUserSchema), likeUser);

// **Define Dynamic Routes After Specific Routes**
// @route   POST /api/users/:id/profile/picture
router.post(
  "/:id/profile/picture",
  upload.single("profilePicture"),
  uploadProfilePicture
);

// @route   POST /api/users/:id/complete-profile
router.post(
  "/:id/complete-profile",
  validateRequest(updateProfileSchema),
  completeProfile
);

// @route   POST /api/users/:id/travel-photos
router.post(
  "/:id/travel-photos",
  upload.single("travelPhoto"),
  uploadTravelPhoto
);

// @route   DELETE /api/users/:id/travel-photos
router.delete("/:id/travel-photos", deleteTravelPhoto);

// @route   GET /api/users/:id
router.get("/:id", getProfile);

// @route   PUT /api/users/:id
router.put("/:id", validateRequest(updateProfileSchema), updateProfile);

// @route   DELETE /api/users/:id
router.delete("/:id", deleteAccount);

// @route   GET /api/users
router.get("/", validateRequest(searchUsersSchema), searchUsers);

export default router;
