// src/components/common/PrivateRoute.tsx

import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useAppSelector } from "../store/hooks";
import authSlice, { selectIsAuthenticated } from "./../slices/authSlice";
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const navigation = useNavigation();

  if (isAuthenticated) {
    return <>{children}</>;
  } else {
    navigation.navigate("Login");
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PrivateRoute;
