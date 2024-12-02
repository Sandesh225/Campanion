// src/navigation/index.tsx

import React, { Suspense } from "react";
import { ActivityIndicator } from "react-native-paper";
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import useAuth from "../hooks/useAuth"; // Correct import
import { RootStackParamList } from "../types/navigation";

// Lazy load screens
const LoginScreen = React.lazy(() => import("../screens/Auth/LoginScreen"));
const RegisterScreen = React.lazy(
  () => import("../screens/Auth/RegisterScreen")
);
const ForgotPasswordScreen = React.lazy(
  () => import("../screens/Auth/ForgotPasswordScreen")
);
const HomeScreen = React.lazy(() => import("../screens/Home/HomeScreen"));
const ProfileWizard = React.lazy(
  () => import("../components/MultiStepForm/ProfileWizard")
);
const DashboardScreen = React.lazy(
  () => import("../screens/Dashboard/DashboardScreen")
);
const ProfileScreen = React.lazy(
  () => import("../screens/Profile/ProfileScreen")
);
const ChatScreen = React.lazy(() => import("../screens/Chat/ChatScreen"));
const SwipeScreen = React.lazy(() => import("../screens/Swipe/SwipeScreen"));
const MatchesScreen = React.lazy(() => import("../screens/Match/MatchScreen"));

const Stack = createNativeStackNavigator<RootStackParamList>();

const config: NativeStackNavigationOptions = {
  animation: "slide_from_right",
  headerShown: false,
};

const AppNavigator: React.FC = () => {
  const { isLoggedIn } = useAuth(); // Use the hook

  return (
    <NavigationContainer theme={NavigationDefaultTheme}>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? "Home" : "Login"}
        screenOptions={config}
      >
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Home">
              {() => (
                <Suspense
                  fallback={<ActivityIndicator size="large" color="#6200ee" />}
                >
                  <HomeScreen />
                </Suspense>
              )}
            </Stack.Screen>
            <Stack.Screen name="ProfileWizard">
              {() => (
                <Suspense
                  fallback={<ActivityIndicator size="large" color="#6200ee" />}
                >
                  <ProfileWizard />
                </Suspense>
              )}
            </Stack.Screen>
            <Stack.Screen name="Dashboard">
              {() => (
                <Suspense
                  fallback={<ActivityIndicator size="large" color="#6200ee" />}
                >
                  <DashboardScreen />
                </Suspense>
              )}
            </Stack.Screen>
            <Stack.Screen name="Profile">
              {() => (
                <Suspense
                  fallback={<ActivityIndicator size="large" color="#6200ee" />}
                >
                  <ProfileScreen />
                </Suspense>
              )}
            </Stack.Screen>
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Swipe">
              {() => (
                <Suspense
                  fallback={<ActivityIndicator size="large" color="#6200ee" />}
                >
                  <SwipeScreen />
                </Suspense>
              )}
            </Stack.Screen>
            <Stack.Screen name="Matches">
              {() => (
                <Suspense
                  fallback={<ActivityIndicator size="large" color="#6200ee" />}
                >
                  <MatchesScreen />
                </Suspense>
              )}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="Login">
              {() => (
                <Suspense
                  fallback={<ActivityIndicator size="large" color="#6200ee" />}
                >
                  <LoginScreen />
                </Suspense>
              )}
            </Stack.Screen>
            <Stack.Screen name="Register">
              {() => (
                <Suspense
                  fallback={<ActivityIndicator size="large" color="#6200ee" />}
                >
                  <RegisterScreen />
                </Suspense>
              )}
            </Stack.Screen>
            <Stack.Screen name="ForgotPassword">
              {() => (
                <Suspense
                  fallback={<ActivityIndicator size="large" color="#6200ee" />}
                >
                  <ForgotPasswordScreen />
                </Suspense>
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
