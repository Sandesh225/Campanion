// src/screens/Swipe/SwipeScreen.tsx

import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  StyleSheet,
  View,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import SwipeCard from "../../components/SwipeCard";
import api from "../../services/api";
import { UserProfile, ApiResponse } from "../../types/api";
import { useAuth } from "../../hooks/useAuth"; // Custom hook to access AuthContext
import Toast from "react-native-toast-message";

const SwipeScreen: React.FC = () => {
  const { userId } = useAuth();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchProfiles = useCallback(async () => {
    try {
      const response = await api.get<ApiResponse<UserProfile[]>>("/profiles", {
        params: { userId },
      });
      if (response.data.success) {
        setProfiles(response.data.data);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error: any) {
      console.error("Fetch profiles error:", error);
      Alert.alert("Error", "Failed to fetch profiles.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleSwipeLeft = (targetId: string) => {
    api
      .post("/swipe", { targetId, action: "dislike" })
      .then(() => {
        Toast.show({
          type: "info",
          text1: "Disliked",
          text2: "You have disliked this profile.",
        });
        setProfiles((prev) =>
          prev.filter((profile) => profile._id !== targetId)
        );
      })
      .catch((error) => {
        console.error("Swipe left error:", error);
        Alert.alert("Error", "Failed to dislike profile.");
      });
  };

  const handleSwipeRight = (targetId: string) => {
    api
      .post("/swipe", { targetId, action: "like" })
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Liked",
          text2: "You have liked this profile.",
        });
        setProfiles((prev) =>
          prev.filter((profile) => profile._id !== targetId)
        );
      })
      .catch((error) => {
        console.error("Swipe right error:", error);
        Alert.alert("Error", "Failed to like profile.");
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfiles();
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {profiles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text>No more profiles to display.</Text>
        </View>
      ) : (
        <FlatList
          data={profiles}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <SwipeCard
              profile={item}
              onSwipeLeft={() => handleSwipeLeft(item._id)}
              onSwipeRight={() => handleSwipeRight(item._id)}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SwipeScreen;
