// src/screens/Match/MatchScreen.tsx

import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Avatar, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import api from "../../services/api";
import { UserProfile, ApiResponse } from "../../types/api";
import { RootStackParamList } from "../../types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthContext } from "../../context/AuthContext";
import { showToast } from "../../utils/toast";

type NavigationProps = StackNavigationProp<RootStackParamList>;

const MatchScreen: React.FC = () => {
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const navigation = useNavigation<NavigationProps>();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await api.get<ApiResponse<UserProfile[]>>(
          "/users/matches"
        );
        if (response.data.success) {
          setMatches(response.data.data);
        } else {
          showToast(
            "error",
            "Error",
            response.data.message || "Failed to load matches."
          );
        }
      } catch (error: any) {
        console.error("Error fetching matches:", error);
        showToast("error", "Error", "Failed to load matches.");
      }
    };

    fetchMatches();
  }, []);

  const startChat = (matchedUserId: string) => {
    // Create or get conversationId
    // For simplicity, we'll assume we get it from the server
    api
      .post<ApiResponse<{ conversationId: string }>>("/chat/start", {
        userId: matchedUserId,
      })
      .then((response) => {
        if (response.data.success) {
          navigation.navigate("Chat", {
            conversationId: response.data.data.conversationId,
          });
        } else {
          showToast(
            "error",
            "Error",
            response.data.message || "Failed to start chat."
          );
        }
      })
      .catch((error) => {
        console.error("Error starting chat:", error);
        showToast("error", "Error", "Failed to start chat.");
      });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => startChat(item.id)}
          >
            <Avatar.Image
              size={50}
              source={{
                uri: item.profilePictureUrl || "https://via.placeholder.com/50",
              }}
            />
            <Text style={styles.name}>{item.fullName}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No matches found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  name: {
    marginLeft: 15,
    fontSize: 18,
  },
});

export default MatchScreen;
