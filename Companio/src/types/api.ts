// src/types/api.ts

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  errors: any[];
  success: boolean;
}

export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  profile: {
    fullName: string;
    bio?: string;
    profilePictureUrl?: string;
    preferences: {
      travelStyles: string[];
      interests: string[];
      activities: string[];
    };
    settings: {
      privacy: string;
      notifications: {
        emailNotifications: boolean;
        pushNotifications: boolean;
      };
    };
    badges?: Badge[];
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export interface ChatMessage {
  _id: string;
  senderId: string;
  message: string;
  timestamp: string;
}

export interface UpdateProfileResponse {
  _id: string;
  username: string;
  email: string;
  profile: UserProfile["profile"];
}

export interface UploadProfilePictureResponse {
  profilePictureUrl: string;
}

export interface Match {
  id: string; // or _id, based on API response
  matchedUserName: string;
  matchedUserPhotoUrl?: string;
  bio?: string;
}
