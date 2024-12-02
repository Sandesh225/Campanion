import React, { useEffect } from "react";
import { Animated, StyleSheet, Image, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const PlaneAnimation: React.FC = () => {
  const planeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(planeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }, []);

  const translateX = planeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, width + 100], // Move from left outside the screen to right outside
  });

  const translateY = planeAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [height - 100, height - 300, height - 500], // Create an arc path
  });

  const opacity = planeAnim.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [1, 1, 0],
  });

  return (
    <Animated.View
      style={[
        styles.plane,
        {
          transform: [{ translateX }, { translateY }],
          opacity,
        },
      ]}
    >
      <Image
        source={require("../assets/plane.png")} // Ensure plane.png exists in assets
        style={styles.planeImage}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  plane: {
    position: "absolute",
    width: 50,
    height: 50,
  },
  planeImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});

export default PlaneAnimation;
