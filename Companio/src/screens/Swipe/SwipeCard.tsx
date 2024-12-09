// src/components/Swipe/SwipeCard.tsx

import React from "react";
import { View, StyleSheet, Image, Text, Dimensions } from "react-native";
import { UserProfile } from "../../types/api";

const { width } = Dimensions.get("window");

interface SwipeCardProps {
  profile: UserProfile;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ profile }) => {
  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: profile.profilePictureUrl || "https://via.placeholder.com/300",
        }}
        style={styles.image}
      />
      <Text style={styles.name}>{profile.fullName}</Text>
      <Text style={styles.bio}>{profile.bio}</Text>
      {/* Add more profile details as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
    height: width * 1.2,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    alignItems: "center",
    padding: 10,
  },
  image: {
    width: "100%",
    height: "70%",
    borderRadius: 10,
  },
  name: {
    fontSize: 24,
    marginTop: 10,
  },
  bio: {
    fontSize: 16,
    marginTop: 5,
    textAlign: "center",
  },
});

export default SwipeCard;
