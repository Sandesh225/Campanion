// src/components/AnimatedMap.tsx

import React from "react";
import { StyleSheet, View, Image } from "react-native";

const AnimatedMap: React.FC = () => {
  // Implement your animated map here.
  // For simplicity, using a static image. Replace with actual animation.
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/animated-map.gif")} // Replace with your animated map
        style={styles.map}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default AnimatedMap;
