// src/types/api.ts

export interface UserProfile {
  profilePictureUrl?: string;
  fullName: string;
  bio?: string;
  preferences: Preferences;

  travelPhotos: string[];
  settings?: UserSettings;
  id: string;
  badges: Badge[];
}

export interface User extends UserProfile {
  username: string;
  email: string;
  accessToken: string;
}

export interface AuthData {
  accessToken: string;
  user: User;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface UploadProfilePictureResponse {
  profilePictureUrl: string;
}

export interface Badge {
  name: string;
  description: string;
  iconUrl?: string;
}
export interface Preferences {
  travelStyles: string[];
  interests: string[];
  activities: string[];
  // Add other preference fields as needed
}

export interface Badge {
  name: string;
  description: string;
  iconUrl?: string;
}
export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelMode: string;
  budget: {
    amount: number;
    currency: string;
  };
  participants: string[];
}

export interface Preferences {
  travelStyles: string[];
  interests: string[];
  activities: string[];
}

export interface UserSettings {
  privacy: "public" | "private";
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
}

export interface LikePayload {
  userId: string;
  likedUserId: string;
}

export interface UpdateProfilePayload {
  userId: string;
  profile: Partial<UserProfile>;
}

export interface UploadPhotoPayload {
  userId: string;
  file: any;
}
