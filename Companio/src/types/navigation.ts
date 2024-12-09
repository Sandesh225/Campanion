// types/navigation.ts
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  TripCreation: undefined;
  TripDetails: { tripId: string };
  Profile: undefined;
  Chat: { userId: string };
  MainStack: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  Dashboard: undefined;
  Login: undefined;
  Register: undefined;
  TripCreation: undefined;
  TripDetails: { tripId: string };
  Profile: { name?: string };
  EditProfile: undefined;
  Swipe: undefined;
  Chat: undefined;
  Match: undefined;
  FindCompanions: undefined;
  PlanTrips: undefined;
  NearbyActivities: undefined;
};
