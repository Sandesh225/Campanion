// src/screens/Swipe/SwipeScreen.tsx

import React, { useRef } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Swiper from "react-native-deck-swiper";
import SwipeCard from "./SwipeCard";
import { useSearchUsersQuery, useLikeUserMutation } from "../../api/authApi";
import useAppSelector from "../../hooks/useAppSelector";
import { selectAuthUser } from "../../features/authSlice";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import Loading from "../../components/Loading";
import { Text } from "react-native-paper";

const { width, height } = Dimensions.get("window");

const SwipeScreen: React.FC = () => {
  const user = useAppSelector(selectAuthUser);
  const { data, error, isLoading } = useSearchUsersQuery({
    excludeUserId: user?.id,
  });
  const [likeUser] = useLikeUserMutation();
  const swiperRef = useRef<any>(null);

  if (isLoading) return <Loading />;

  if (error || !data) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error fetching profiles.</Text>
      </View>
    );
  }

  const profiles = data.data;

  const handleSwipe = async (
    cardIndex: number,
    direction: "left" | "right" | "top" | "bottom"
  ) => {
    const likedProfile = profiles[cardIndex];
    if (direction === "right") {
      try {
        await likeUser({
          userId: user?.id || "",
          likedUserId: likedProfile.id,
        }).unwrap();
        showSuccessToast("Liked", `You liked ${likedProfile.username}`);
      } catch (err: any) {
        showErrorToast(
          "Like Failed",
          err?.data?.message || "Failed to like user."
        );
      }
    }
    // Handle other swipe directions if needed
  };

  return (
    <View style={styles.container}>
      <Swiper
        ref={swiperRef}
        cards={profiles}
        renderCard={(card) => <SwipeCard profile={card} />}
        onSwiped={(cardIndex) => {}}
        onSwipedLeft={(cardIndex) => handleSwipe(cardIndex, "left")}
        onSwipedRight={(cardIndex) => handleSwipe(cardIndex, "right")}
        cardIndex={0}
        backgroundColor="#f0f0f0"
        stackSize={3}
        infinite
        animateCardOpacity
        verticalSwipe={false}
        horizontalThreshold={width * 0.25}
        stackSeparation={15}
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
                marginLeft: -width * 0.25,
              },
            },
          },
          right: {
            title: "LIKE",
            style: {
              label: {
                backgroundColor: "green",
                color: "white",
                fontSize: 24,
              },
              wrapper: {
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                marginTop: 20,
                marginLeft: width * 0.25,
              },
            },
          },
        }}
        disableBottomSwipe
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SwipeScreen;
