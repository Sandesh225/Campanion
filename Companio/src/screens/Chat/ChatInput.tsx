// src/components/Chat/ChatInput.tsx

import React, { useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

interface ChatInputProps {
  onSend: (content: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [text, setText] = useState<string>("");

  const handleSend = () => {
    if (text.trim().length > 0) {
      onSend(text.trim());
      setText("");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Type a message"
        style={styles.input}
        value={text}
        onChangeText={setText}
      />
      <TouchableOpacity onPress={handleSend} style={styles.button}>
        <MaterialIcon name="send" size={24} color="#6200ee" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 10,
  },
  button: {
    justifyContent: "center",
  },
});

export default ChatInput;
