// src/types/auth.ts

export interface User {
  id: string;
  username: string;
  email: string;
  profilePictureUrl?: string;
  bio?: string;
}

export interface AuthResponse {
  data: {
    id: string;
    username: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    user?: User;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  // Add other relevant fields as needed
}
