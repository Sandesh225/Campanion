// src/screens/Chat/ChatScreen.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";

type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">;

interface ChatScreenProps {
  route: ChatScreenRouteProp;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
  const { otherUserId } = route.params;

  return (
    <View style={styles.container}>
      <Text>Chat with {otherUserId}</Text>
      {/* Implement your chat UI here */}
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
