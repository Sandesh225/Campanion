// src/screens/SplashScreen.tsx
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { useAppDispatch } from "../hooks/hooks";
import { loadTokens } from "../features/auth/authSlice";

const SplashScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  useEffect(() => {
    dispatch(loadTokens());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <ActivityIndicator
        animating={true}
        color={theme.colors.primary}
        size="large"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
