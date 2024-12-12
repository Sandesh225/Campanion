export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  TripCreation: undefined;
  TripDetails: { tripId: string };
  Profile: undefined;
  Chat: { userId: string };
  MainStack: undefined;
  Home: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};
export type MainStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  FindCompanions: undefined;
  PlanTrips: undefined;
  NearbyActivities: undefined;
  Dashboard: undefined;
  Profile: undefined;
  Swipe: undefined;
  Match: { conversationId: string };
  Chat: { conversationId: string };
  EditProfile: undefined;
};
