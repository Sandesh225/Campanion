// src/navigation/AuthNavigator.tsx
import React, { Suspense, lazy } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View } from "react-native";
import { AuthStackParamList } from "../types/navigation";

const LoginScreen = lazy(() => import("../screens/Login/LoginScreen"));
const RegisterScreen = lazy(() => import("../screens/Register/RegisterScreen"));
const ForgotPasswordScreen = lazy(
  () => import("../screens/ForgotPasswordScreen")
);

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
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
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    </Suspense>
  );
};

export default AuthNavigator;
