// src/components/SwipeCard.tsx

import React from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Text, Card, Avatar } from "react-native-paper";
import { UserProfile } from "../types/api";

interface SwipeCardProps {
  profile: UserProfile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const { width } = Dimensions.get("window");

  return (
    <Card style={[styles.card, { width: width - 20 }]}>
      <Card.Cover
        source={{
          uri:
            profile.profile.profilePictureUrl ||
            "https://via.placeholder.com/300",
        }}
      />
      <Card.Content>
        <Text variant="headlineSmall">{profile.profile.fullName}</Text>
        <Text variant="bodyMedium">@{profile.username}</Text>
        <Text variant="bodySmall">{profile.profile.bio}</Text>
      </Card.Content>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onSwipeLeft}>
          <Avatar.Icon size={40} icon="close" style={styles.dislikeButton} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onSwipeRight}>
          <Avatar.Icon size={40} icon="check" style={styles.likeButton} />
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  dislikeButton: {
    backgroundColor: "#FF5252",
  },
  likeButton: {
    backgroundColor: "#4CAF50",
  },
});

export default SwipeCard;
