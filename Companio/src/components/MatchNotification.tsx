// src/components/MatchNotification.tsx

import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Text, Button, Card } from "react-native-paper";

interface MatchNotificationProps {
  match: {
    matchedProfileId: string;
    matchedProfileName: string;
    matchedProfilePhotoUrl: string;
  };
  onStartChat: (profileId: string) => void;
}

const MatchNotification: React.FC<MatchNotificationProps> = ({
  match,
  onStartChat,
}) => {
  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <Image
          source={{
            uri:
              match.matchedProfilePhotoUrl || "https://via.placeholder.com/100",
          }}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text variant="titleMedium">New Match!</Text>
          <Text variant="bodyMedium">
            You matched with {match.matchedProfileName}
          </Text>
          <Button
            mode="contained"
            onPress={() => onStartChat(match.matchedProfileId)}
            style={styles.button}
          >
            Start Chat
          </Button>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#e0ffe0",
    elevation: 6,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  button: {
    marginTop: 10,
  },
});

export default MatchNotification;
