// frontend/src/components/ProfilePreview.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Avatar, Card } from "react-native-paper";

interface ProfilePreviewProps {
  data: {
    profilePictureUrl?: string;
    fullName?: string;
    username?: string;
    bio?: string;
  };
}

const ProfilePreview: React.FC<ProfilePreviewProps> = ({ data }) => {
  return (
    <Card style={styles.container}>
      <Card.Content>
        <View style={styles.profileContainer}>
          <Avatar.Image
            source={{
              uri: data.profilePictureUrl || "https://via.placeholder.com/100",
            }}
            size={100}
            style={styles.profileImage}
          />
          <Text variant="headlineSmall" style={styles.name}>
            {data.fullName || "Full Name"}
          </Text>
          <Text variant="bodyMedium" style={styles.username}>
            @{data.username || "username"}
          </Text>
          <Text variant="bodySmall" style={styles.bio}>
            {data.bio || "This is your bio..."}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    borderRadius: 10,
    elevation: 4,
    backgroundColor: "#fff",
  },
  profileContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  profileImage: {
    marginBottom: 15,
  },
  name: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 18,
    color: "#4CAF50",
  },
  username: {
    color: "#FFC107",
    marginBottom: 10,
  },
  bio: {
    textAlign: "center",
    color: "#555",
  },
});

export default React.memo(ProfilePreview);
