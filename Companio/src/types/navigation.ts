// src/types/navigation.ts

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  ProfileWizard: undefined;
  Dashboard: undefined;
  Profile: undefined;
  Chat: { otherUserId: string };
  Swipe: undefined;
  Matches: undefined;
};
