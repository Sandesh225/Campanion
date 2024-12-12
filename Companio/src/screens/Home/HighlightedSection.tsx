// src/components/home/HighlightedSection.tsx

import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import { showInfoToast } from "../../utils/toast";

const HighlightedSection: React.FC = () => {
  const handlePress = () => {
    showInfoToast("Explore", "Navigate to discover new trips.");
    // Optionally, navigate to a detailed screen
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Discover New Trips"
      >
        <Card style={styles.card}>
          <Card.Cover
            source={{ uri: "https://via.placeholder.com/300x150" }}
            resizeMode="cover"
            accessible={true}
            accessibilityLabel="Discover New Trips Image"
          />
          <Card.Content>
            <Title>Discover New Trips</Title>
            <Paragraph>
              Explore exciting new destinations with Companio.
            </Paragraph>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  card: {
    borderRadius: 12,
    overflow: "hidden",
  },
});

export default React.memo(HighlightedSection);
