// src/components/Profile/BadgeItem.tsx

import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, Card } from "react-native-paper";

interface BadgeItemProps {
  badge: {
    name: string;
    description: string;
    iconUrl?: string;
  };
}

const BadgeItem: React.FC<BadgeItemProps> = ({ badge }) => {
  return (
    <Card style={styles.card} elevation={2}>
      <View style={styles.container}>
        {badge.iconUrl ? (
          <Image source={{ uri: badge.iconUrl }} style={styles.icon} />
        ) : (
          <Card.Cover
            source={{ uri: "https://via.placeholder.com/50" }}
            style={styles.icon}
          />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.name}>{badge.name}</Text>
          <Text style={styles.description}>{badge.description}</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150,
    marginRight: 10,
    borderRadius: 10,
  },
  container: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 12,
    color: "#666",
  },
});

export default BadgeItem;
