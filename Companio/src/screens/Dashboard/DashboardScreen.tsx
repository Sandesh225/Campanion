// src/screens/Dashboard/DashboardScreen.tsx

import React from "react";
import { View, StyleSheet, Text } from "react-native";

const DashboardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dashboard</Text>
      {/* Implement dashboard functionalities here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6200ee",
  },
});

export default DashboardScreen;
