// // src/screens/Chat/ChatScreen.tsx

// import React, { useEffect, useState, useContext } from "react";
// import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
// import ChatBubble from "./ChatBubble";
// import ChatInput from "./ChatInput";
// import { AuthContext } from "../../context/AuthContext";
// import { ChatMessage, ApiResponse } from "../../types/api";
// import { useNavigation, RouteProp } from "@react-navigation/native";
// import io from "socket.io-client";
// import { Config } from "../../config";
// import api from "../../services/api";
// import { showToast } from "../../utils/toast";
// import { RootStackParamList } from "../../types/navigation";

// type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">;

// interface ChatScreenProps {
//   route: ChatScreenRouteProp;
// }

// const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
//   const { user } = useContext(AuthContext);
//   const { conversationId } = route.params;
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const navigation = useNavigation();
//   const [socket, setSocket] = useState<any>(null);

//   useEffect(() => {
//     if (!user) {
//       showToast("error", "Not authenticated", "Please log in to access chat.");
//       navigation.navigate("Login");
//       return;
//     }

//     const newSocket = io(Config.SOCKET_URL, {
//       query: { userId: user.id },
//       transports: ["websocket"],
//     });

//     setSocket(newSocket);

//     newSocket.on("connect", () => {
//       console.log("Connected to chat server");
//       newSocket.emit("joinRoom", conversationId);
//     });

//     newSocket.on("message", (message: ChatMessage) => {
//       setMessages((prev) => [...prev, message]);
//     });

//     newSocket.on("disconnect", () => {
//       console.log("Disconnected from chat server");
//     });

//     // Fetch existing messages
//     const fetchMessages = async () => {
//       try {
//         const response = await api.get<ApiResponse<ChatMessage[]>>(
//           "/chat/messages",
//           {
//             params: { conversationId },
//           }
//         );
//         if (response.data.success) {
//           setMessages(response.data.data);
//         } else {
//           showToast("error", "Error", "Failed to load messages.");
//         }
//       } catch (error: any) {
//         console.error("Fetch messages error:", error);
//         showToast("error", "Error", "Failed to load messages.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMessages();

//     return () => {
//       newSocket.disconnect();
//     };
//   }, [user, navigation, conversationId]);

//   const handleSend = (content: string) => {
//     if (socket && user) {
//       const message: ChatMessage = {
//         id: `${Date.now()}`,
//         senderId: user.id,
//         content,
//         timestamp: new Date().toISOString(),
//       };
//       socket.emit("sendMessage", { conversationId, message });
//       setMessages((prev) => [...prev, message]);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="#6200ee" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={messages}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <ChatBubble message={item} isMe={item.senderId === user?.id} />
//         )}
//         contentContainerStyle={styles.messagesContainer}
//       />
//       <ChatInput onSend={handleSend} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   messagesContainer: {
//     padding: 10,
//   },
//   loader: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

// export default ChatScreen;
// src/screens/Chat/ChatScreen.tsx

import React from "react";
import { View, Text } from "react-native";

const ChatScreen: React.FC = () => {
  return (
    <View>
      <Text>Chat Screen</Text>
    </View>
  );
};

export default ChatScreen; // Use default export
