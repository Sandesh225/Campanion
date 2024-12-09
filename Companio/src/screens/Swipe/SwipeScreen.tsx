// src/screens/Swipe/SwipeScreen.tsx

import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import DeckSwiper from "react-native-deck-swiper";
import SwipeCard from "./SwipeCard";
import api from "../../services/api";
import { UserProfile, ApiResponse } from "../../types/api";
import { showToast } from "../../utils/toast";
import { Text } from "react-native-paper";

const { width } = Dimensions.get("window");

const SwipeScreen: React.FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await api.get<ApiResponse<UserProfile[]>>(
          "/users/profiles"
        );
        if (response.data.success) {
          setProfiles(response.data.data);
        } else {
          showToast(
            "error",
            "Error",
            response.data.message || "Failed to load profiles."
          );
        }
      } catch (error: any) {
        console.error("Error fetching profiles:", error);
        showToast("error", "Error", "Failed to load profiles.");
      }
    };

    fetchProfiles();
  }, []);

  const handleSwipedLeft = (cardIndex: number) => {
    console.log("Swiped Left on index:", cardIndex);
    // Handle swipe left (dislike)
  };

  const handleSwipedRight = async (cardIndex: number) => {
    console.log("Swiped Right on index:", cardIndex);
    const swipedProfile = profiles[cardIndex];
    try {
      const response = await api.post<ApiResponse<any>>("/users/match", {
        matchedUserId: swipedProfile.id,
      });
      if (response.data.success) {
        showToast("success", "Matched!", "You have a new match!");
        // Handle match
      } else {
        showToast(
          "error",
          "Error",
          response.data.message || "Failed to process match."
        );
      }
    } catch (error: any) {
      console.error("Error processing match:", error);
      showToast("error", "Error", "Failed to process match.");
    }
  };

  return (
    <View style={styles.container}>
      {profiles.length > 0 ? (
        <DeckSwiper
          cards={profiles}
          renderCard={(profile) => <SwipeCard profile={profile} />}
          onSwipedLeft={handleSwipedLeft}
          onSwipedRight={handleSwipedRight}
          cardIndex={index}
          backgroundColor={"#f0f0f0"}
          stackSize={3}
          verticalSwipe={false}
        />
      ) : (
        <View style={styles.noProfiles}>
          <Text>No profiles available at the moment.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noProfiles: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SwipeScreen;
