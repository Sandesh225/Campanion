// src/components/SwipeMatch.tsx

import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, Dimensions, Alert } from "react-native";
import Swiper from "react-native-deck-swiper";
import {
  Card,
  Avatar,
  Text,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import api from "../services/api";
import { UserProfile, ApiResponse } from "../types/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { showToast } from "../utils/toast";

const { width, height } = Dimensions.get("window");

const SwipeMatch: React.FC = () => {
  const { userId } = useContext(AuthContext);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchSwipeUsers = async () => {
      if (!userId) {
        showToast("error", "Error", "User not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get<ApiResponse<UserProfile[]>>(
          "/users/random",
          {
            params: { page: 1, limit: 20 },
          }
        );
        if (response.data.success) {
          setUsers(response.data.data);
        } else {
          console.error("Failed to fetch swipe users:", response.data.message);
          showToast("error", "Error", "Failed to fetch users.");
        }
      } catch (error: any) {
        console.error("Error fetching swipe users:", error);
        showToast("error", "Error", "An error occurred while fetching users.");
      } finally {
        setLoading(false);
      }
    };

    fetchSwipeUsers();
  }, [userId]);

  const handleConnect = async (matchedUserId: string) => {
    try {
      const response = await api.post("/users/like", {
        userId,
        likedUserId: matchedUserId,
      });

      if (response.data.success) {
        if (response.data.data.matched) {
          showToast(
            "success",
            "It's a Match!",
            "You and the user have matched!"
          );
          navigation.navigate("Chat", { otherUserId: matchedUserId });
        } else {
          showToast("info", "Liked", "User liked successfully.");
        }
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error("Error liking user:", error);
      showToast(
        "error",
        "Error",
        error.response?.data?.message || "Failed to like user."
      );
    }
  };

  const renderCard = (card: UserProfile) => (
    <Card style={styles.card}>
      <Card.Title
        title={card.profile.fullName}
        subtitle={`@${card.username}`}
        left={(props) => (
          <Avatar.Image
            {...props}
            source={{
              uri:
                card.profile.profilePictureUrl ||
                "https://via.placeholder.com/100",
            }}
          />
        )}
      />
      <Card.Content>
        <Text>{card.profile.bio || "No bio available."}</Text>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Swiper
        cards={users}
        renderCard={renderCard}
        onSwipedRight={(cardIndex) => handleConnect(users[cardIndex]._id)}
        cardIndex={0}
        backgroundColor="#E8F5E9"
        stackSize={3}
        stackSeparation={15}
        animateCardOpacity
        overlayLabels={{
          left: {
            title: "NOPE",
            style: {
              label: {
                backgroundColor: "red",
                color: "white",
                fontSize: 24,
              },
              wrapper: {
                flexDirection: "column",
                alignItems: "flex-end",
                justifyContent: "flex-start",
                marginTop: 20,
                marginLeft: -20,
              },
            },
          },
          right: {
            title: "LIKE",
            style: {
              label: {
                backgroundColor: "#4CAF50",
                color: "white",
                fontSize: 24,
              },
              wrapper: {
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                marginTop: 20,
                marginLeft: 20,
              },
            },
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: width - 40,
    height: height - 300,
    borderRadius: 10,
    elevation: 4,
    backgroundColor: "#fff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SwipeMatch;
