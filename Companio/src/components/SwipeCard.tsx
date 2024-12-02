// src/components/SwipeCard.tsx

import React from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";
import { Card, Text, Button } from "react-native-paper";

interface SwipeCardProps {
  profile: any; // Define a proper type based on your API response
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const screenWidth = Dimensions.get("window").width;
  return (
    <Card style={[styles.card, { width: screenWidth - 40 }]}>
      <Card.Cover
        source={{
          uri: profile.profilePictureUrl || "https://via.placeholder.com/300",
        }}
      />
      <Card.Content>
        <Text variant="titleLarge">{profile.username}</Text>
        <Text variant="bodyMedium">{profile.bio || "No bio available."}</Text>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button mode="outlined" onPress={onSwipeLeft} style={styles.button}>
          Dislike
        </Button>
        <Button mode="contained" onPress={onSwipeRight} style={styles.button}>
          Like
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    alignSelf: "center",
    marginVertical: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 10,
  },
  button: {
    width: "40%",
  },
});

export default SwipeCard;
