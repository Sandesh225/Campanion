import React from "react";
import { View, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";

const SwipeActions = ({ onLike, onDislike, onSuperSwipe }) => {
  return (
    <View style={styles.container}>
      <IconButton
        icon="close"
        size={30}
        onPress={onDislike}
        style={styles.dislikeButton}
      />
      <IconButton
        icon="star"
        size={30}
        onPress={onSuperSwipe}
        style={styles.superSwipeButton}
      />
      <IconButton
        icon="heart"
        size={30}
        onPress={onLike}
        style={styles.likeButton}
      />
    </View>
  );
};

export default SwipeActions;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  likeButton: {
    backgroundColor: "#4CAF50",
  },
  dislikeButton: {
    backgroundColor: "#F44336",
  },
  superSwipeButton: {
    backgroundColor: "#FFC107",
  },
});
