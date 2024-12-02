// src/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const { Schema } = mongoose;

// Sub-schemas
const preferencesSchema = new Schema(
  {
    travelStyles: {
      type: [String],
      enum: [
        "Solo Traveler",
        "Family Traveler",
        "Backpacker",
        "Luxury Traveler",
        "Adventure Traveler",
        "Business Traveler",
        "Digital Nomad",
        "Road Tripper",
        "Eco Traveler",
        "Cultural Explorer",
        "Wellness Traveler",
        "Beach Lover",
        "Mountain Explorer",
        "Cruise Traveler",
        "Budget Traveler",
        "Group Traveler",
        "Glamping Traveler",
      ],
      default: ["Solo Traveler"],
    },
    culinary: { type: [String], default: [] },
    interests: [{ type: String, trim: true }],
    activities: { type: [String], default: [] },
    languages: [{ type: String, trim: true }],
  },
  { _id: false }
);

const settingsSchema = new Schema(
  {
    privacy: {
      profileVisibility: {
        type: String,
        enum: ["public", "private"],
        default: "public",
      },
      searchVisibility: { type: Boolean, default: true },
    },
    notifications: {
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
    },
  },
  { _id: false }
);

const statusSchema = new Schema(
  {
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    deletedAt: { type: Date, default: null },
  },
  { _id: false }
);

const securitySchema = new Schema(
  {
    failedLoginAttempts: { type: Number, default: 0 },
    lockoutUntil: { type: Date },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },
  },
  { _id: false }
);

const tokensSchema = new Schema(
  {
    refreshToken: { type: String, default: null },
    passwordResetToken: { type: String, default: null },
    passwordResetTokenExpiry: { type: Date, default: null },
    verificationToken: { type: String, default: null },
    verificationTokenExpiry: { type: Date, default: null },
  },
  { _id: false }
);

const badgeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Badge name is required"],
    },
    description: {
      type: String,
      default: "",
    },
    iconUrl: {
      type: String,
      default: "https://via.placeholder.com/100",
    },
  },
  { _id: false }
);

// Main User Schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username must be at most 30 characters"],
      index: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
      validate: {
        validator: function (value) {
          return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])/.test(value);
        },
        message:
          "Password must include one uppercase, one lowercase, one digit, and one special character.",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", index: true }],
    matches: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    ],
    profilePicture: {
      type: String,
      default: "", // URL to the profile picture
    },
    travelPhotos: {
      type: [String], // Array of photo URLs
      default: [],
      validate: [arrayLimit, "{PATH} exceeds the limit of 8"],
    },
    bio: {
      type: String,
      maxlength: [150, "Bio must not exceed 150 characters"],
      default: "",
    },
    profile: {
      type: preferencesSchema,
      default: () => ({}),
    },
    settings: {
      type: settingsSchema,
      default: () => ({}),
    },
    status: {
      type: statusSchema,
      default: () => ({}),
    },
    security: {
      type: securitySchema,
      default: () => ({}),
    },
    badges: {
      type: [badgeSchema],
      default: [],
    },
    tokens: {
      type: tokensSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Helper function to limit the array size for travelPhotos
function arrayLimit(val) {
  return val.length <= 8; // Limit the array to 8 items
}

// Indexing for performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ "tokens.refreshToken": 1 });

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12); // Increased salt rounds for better security
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password validation method
userSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Method to generate password reset token
userSchema.methods.generatePasswordReset = function () {
  this.tokens.passwordResetToken = uuidv4();
  this.tokens.passwordResetTokenExpiry = Date.now() + 3600000; // 1 hour
};

// Exclude sensitive fields from the output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.tokens;
  delete obj.security.twoFactorSecret;
  return obj;
};

// Export User model
const User = mongoose.model("User", userSchema);

export { User };
