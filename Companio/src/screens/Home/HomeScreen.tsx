// src/screens/Home/HomeScreen.tsx

import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, Surface } from "react-native-paper";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";
import CustomAppBar from "../../components/common/CustomAppBar";
import useAuth from "../../hooks/useAuth"; // Correct import

type NavigationProps = NavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const { userId } = useAuth(); // Use the hook

  const navigateToSwipe = () => {
    navigation.navigate("Swipe");
  };

  const navigateToDashboard = () => {
    navigation.navigate("Dashboard");
  };

  return (
    <View style={styles.container}>
      <CustomAppBar title="Home" showProfileButton={true} />
      <Surface style={styles.content}>
        <Text variant="headlineMedium" style={styles.welcomeText}>
          Welcome to Companion App!
        </Text>
        <Button
          mode="contained"
          onPress={navigateToSwipe}
          style={styles.button}
          contentStyle={styles.buttonContent}
          accessibilityLabel="Start Swiping"
          accessibilityHint="Navigate to the swipe screen to find companions"
        >
          Start Swiping
        </Button>
        <Button
          mode="outlined"
          onPress={navigateToDashboard}
          style={styles.button}
          contentStyle={styles.buttonContent}
          accessibilityLabel="Go to Dashboard"
          accessibilityHint="Navigate to your dashboard to view matches and badges"
        >
          Go to Dashboard
        </Button>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 4,
    alignItems: "center",
  },
  welcomeText: {
    marginBottom: 30,
    textAlign: "center",
    color: "#6200ee",
  },
  button: {
    width: "80%",
    marginVertical: 10,
  },
  buttonContent: {
    paddingVertical: 10,
  },
});

export default HomeScreen;
