import React from "react";
import { StyleSheet } from "react-native";
import { Button, Text, Surface } from "react-native-paper";
import LottieView from "lottie-react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import { showToast } from "../../utils/toast";

type NavigationProps = NavigationProp<RootStackParamList>;

const Completion: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();

  const handleGoToDashboard = () => {
    navigation.navigate("Dashboard");
    showToast(
      "success",
      "Welcome!",
      "Your profile has been set up successfully."
    );
  };

  return (
    <Surface style={styles.container}>
      <LottieView
        source={require("../../assets/animations/success.json")} // Ensure this file exists
        autoPlay
        loop={false}
        style={styles.animation}
      />
      <Text variant="headlineSmall" style={styles.title}>
        Profile Completed!
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        You have successfully created your profile.
      </Text>
      <Button
        mode="contained"
        onPress={handleGoToDashboard}
        style={styles.button}
      >
        Go to Dashboard
      </Button>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  animation: {
    width: 150,
    height: 150,
  },
  title: {
    marginTop: 20,
    marginBottom: 10,
    color: "#6200ee",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  button: {
    marginTop: 20,
    width: "60%",
  },
});

export default Completion;
