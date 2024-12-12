// src/components/Common/LoadingIndicator.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const LoadingIndicator: React.FC = () => (
  <View style={styles.container}>
    <ActivityIndicator animating={true} size="large" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingIndicator;
