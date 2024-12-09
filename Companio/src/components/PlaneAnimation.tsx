// src/components/PlaneAnimation.tsx

import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

const PlaneAnimation: React.FC = () => {
  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel="Plane Animation"
    >
      <LottieView
        source={require("../assets/animations/login.json")} // Ensure you have a plane.json animation file
        autoPlay
        loop={false}
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: "50%",
    left: width * 0.25,
    width: width * 0.5,
    height: height * 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: "100%",
    height: "100%",
  },
});

export default PlaneAnimation;
