import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainStackParamList } from "../types/navigation";
import {
  selectIsAuthenticated,
  selectAuthLoading,
  clearCredentials,
} from "../slices/authSlice";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useGetMeQuery } from "../services/api";

const Stack = createNativeStackNavigator<MainStackParamList>();

// Lazy-loaded Screens
const HomeScreen = React.lazy(() => import("../screens/Home/HomeScreen"));
const DashboardScreen = React.lazy(
  () => import("../screens/Dashboard/DashboardScreen")
);
const LoginScreen = React.lazy(() => import("../screens/Auth/LoginScreen"));
const RegisterScreen = React.lazy(
  () => import("../screens/Auth/RegisterScreen")
);
const FindCompanionsScreen = React.lazy(
  () => import("../screens/FindCompanions/FindCompanionsScreen")
);
const PlanTripsScreen = React.lazy(
  () => import("../screens/PlanTrips/PlanTripsScreen")
);
const NearbyActivitiesScreen = React.lazy(
  () => import("../screens/NearbyActivities/NearbyActivitiesScreen")
);
const ChatScreen = React.lazy(() => import("../screens/Chat/ChatScreen"));
const ProfileScreen = React.lazy(
  () => import("../screens/Profile/ProfileScreen")
);

const MainStack: React.FC = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);

  // Only fetch user profile if authenticated
  const { data, error, isFetching } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (error) {
      // If fetching user fails, likely invalid token, so clear and show login
      dispatch(clearCredentials());
    }
  }, [error, dispatch]);

  // If user is not authenticated, show auth screens directly
  if (!isAuthenticated) {
    return (
      <React.Suspense
        fallback={
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6200ee" />
          </View>
        }
      >
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: "#6200ee" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </React.Suspense>
    );
  }

  // If authenticated but still loading user data, show spinner
  if (isLoading || isFetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  // If authenticated and user data fetched successfully, show main app screens
  return (
    <React.Suspense
      fallback={
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      }
    >
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#6200ee" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FindCompanions"
          component={FindCompanionsScreen}
          options={{ title: "Find Companions" }}
        />
        <Stack.Screen
          name="PlanTrips"
          component={PlanTripsScreen}
          options={{ title: "Plan Trips" }}
        />
        <Stack.Screen
          name="NearbyActivities"
          component={NearbyActivitiesScreen}
          options={{ title: "Nearby Activities" }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{ title: "Chat" }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: "My Profile" }}
        />
      </Stack.Navigator>
    </React.Suspense>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MainStack;
