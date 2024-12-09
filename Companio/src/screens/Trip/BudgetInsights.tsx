import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, ProgressBar } from "react-native-paper";

interface BudgetInsightsProps {
  budget: number;
  spent: number;
}

const BudgetInsights: React.FC<BudgetInsightsProps> = ({ budget, spent }) => {
  const progress = budget > 0 ? spent / budget : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Budget: ${spent.toFixed(2)} / ${budget.toFixed(2)}
      </Text>
      <ProgressBar
        progress={progress}
        color="#6200ee"
        style={styles.progress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: "100%",
  },
  text: {
    marginBottom: 5,
    fontSize: 16,
    color: "#333",
  },
  progress: {
    height: 10,
    borderRadius: 5,
  },
});

export default BudgetInsights;
