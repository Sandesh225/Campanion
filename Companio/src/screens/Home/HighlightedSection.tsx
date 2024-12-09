// src/screens/Home/HighlightedSection.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";

const HighlightedSection: React.FC = () => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: "https://via.placeholder.com/300x150" }} />
        <Card.Content>
          <Title>Discover New Trips</Title>
          <Paragraph>
            Explore exciting new destinations with Companio.
          </Paragraph>
        </Card.Content>
      </Card>
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

export default HighlightedSection;
