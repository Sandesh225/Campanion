// src/screens/Chat/ChatScreen.tsx

import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text } from "react-native-paper";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import { useGetMessagesQuery, useSendMessageMutation } from "../../api/chatApi";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

interface ChatScreenProps {
  route: {
    params: {
      conversationId: string;
    };
  };
}

const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
  const { conversationId } = route.params;
  const [messages, setMessages] = useState([]);
  const { data, error, isLoading, refetch } =
    useGetMessagesQuery(conversationId);
  const [sendMessage] = useSendMessageMutation();

  useEffect(() => {
    if (data && data.data) {
      setMessages(data.data);
    }

    if (error) {
      showErrorToast("Error", "Failed to load messages.");
    }
  }, [data, error]);

  const handleSend = async (content: string) => {
    try {
      const newMessage = await sendMessage({
        conversationId,
        content,
      }).unwrap();
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      showSuccessToast("Message Sent", "Your message has been sent.");
    } catch (err: any) {
      showErrorToast(
        "Send Failed",
        err?.data?.message || "Failed to send message."
      );
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <ChatBubble message={item} isMe={item.senderId === "currentUserId"} />
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading messages...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        inverted
        contentContainerStyle={styles.list}
      />
      <ChatInput onSend={handleSend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatScreen;
