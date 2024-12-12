// src/components/Chat/ChatBubble.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { ChatMessage } from "../../types/api";

interface ChatBubbleProps {
  message: ChatMessage;
  isMe: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isMe }) => {
  return (
    <View
      style={[styles.container, isMe ? styles.myMessage : styles.otherMessage]}
    >
      <Text style={styles.text}>{message.content}</Text>
      <Text style={styles.time}>
        {new Date(message.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: "70%",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  myMessage: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: "#FFF",
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 16,
  },
  time: {
    fontSize: 10,
    alignSelf: "flex-end",
  },
});

export default ChatBubble;
