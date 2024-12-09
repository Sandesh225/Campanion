// src/types/index.d.ts

export interface User {
  id: string;
  username: string;
  email: string;
  profilePictureUrl?: string;
  bio?: string;
  // Add other user-related fields
}

export interface Trip {
  _id: string;
  title: string;
  description: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelMode: string;
  budget?: {
    currency: string;
    amount: number;
  };
  // Add other trip-related fields
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  TripCreation: undefined;
  TripDetails: { tripId: string };
  Profile: undefined;
  // Add more screens as needed
};
