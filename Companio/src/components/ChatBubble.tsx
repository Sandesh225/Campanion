// src/components/ChatBubble.tsx

import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, Avatar } from "react-native-paper";

interface ChatBubbleProps {
  message: {
    id: string;
    sender: string;
    content: string;
    timestamp: string;
  };
  isMe: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isMe }) => {
  return (
    <View style={[styles.container, isMe ? styles.me : styles.other]}>
      {!isMe && (
        <Avatar.Text
          size={40}
          label={message.sender.charAt(0).toUpperCase()}
          style={styles.avatar}
        />
      )}
      <View
        style={[styles.bubble, isMe ? styles.meBubble : styles.otherBubble]}
      >
        <Text>{message.content}</Text>
        <Text style={styles.timestamp}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </Text>
      </View>
      {isMe && (
        <Avatar.Text
          size={40}
          label={message.sender.charAt(0).toUpperCase()}
          style={styles.avatar}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 5,
    alignItems: "flex-end",
  },
  me: {
    justifyContent: "flex-end",
  },
  other: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 10,
  },
  meBubble: {
    backgroundColor: "#dcf8c6",
    marginLeft: 10,
  },
  otherBubble: {
    backgroundColor: "#fff",
    marginRight: 10,
  },
  timestamp: {
    fontSize: 10,
    color: "#555",
    textAlign: "right",
    marginTop: 5,
  },
  avatar: {
    marginHorizontal: 5,
  },
});

export default ChatBubble;
