import React from "react";
import { View, StyleSheet } from "react-native";
import { ProgressBar, Text } from "react-native-paper";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  const progress = currentStep / totalSteps;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Step {currentStep} of {totalSteps}
      </Text>
      <ProgressBar progress={progress} color="#6200ee" style={styles.bar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  text: {
    textAlign: "center",
    marginBottom: 5,
    color: "#6200ee",
    fontWeight: "bold",
  },
  bar: {
    height: 10,
    borderRadius: 5,
  },
});

export default ProgressIndicator;
