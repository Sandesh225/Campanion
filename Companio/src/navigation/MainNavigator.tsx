// src/navigation/MainNavigator.tsx
import React, { Suspense, lazy } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View } from "react-native";
import { MainStackParamList } from "../types/navigation";

const HomeScreen = lazy(() => import("../screens/Home/HomeScreen"));
const FindCompanionsScreen = lazy(
  () => import("../screens/FindCompanions/FindCompanionsScreen")
);
const PlanTripsScreen = lazy(
  () => import("../screens/PlanTrips/PlanTripsScreen")
);
const NearbyActivitiesScreen = lazy(
  () => import("../screens/NearbyActivities/NearbyActivitiesScreen")
);
const DashboardScreen = lazy(
  () => import("../screens/Dashboard/DashboardScreen")
);
const ProfileScreen = lazy(() => import("../screens/Profile/ProfileScreen"));
const SwipeScreen = lazy(() => import("../screens/Swipe/SwipeScreen"));
const MatchScreen = lazy(() => import("../screens/Match/MatchScreen"));
const ChatScreen = lazy(() => import("../screens/Chat/ChatScreen"));
const EditProfileScreen = lazy(
  () => import("../screens/Profile/EditProfileScreen")
);

const Stack = createStackNavigator<MainStackParamList>();

const MainNavigator: React.FC = () => {
  return (
    <Suspense
      fallback={
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      }
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="FindCompanions" component={FindCompanionsScreen} />
        <Stack.Screen name="PlanTrips" component={PlanTripsScreen} />
        <Stack.Screen
          name="NearbyActivities"
          component={NearbyActivitiesScreen}
        />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Swipe" component={SwipeScreen} />
        <Stack.Screen name="Match" component={MatchScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      </Stack.Navigator>
    </Suspense>
  );
};

export default MainNavigator;
