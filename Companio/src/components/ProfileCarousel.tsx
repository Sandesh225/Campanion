import React from "react";
import { View, Image, Dimensions, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");

const ProfileCarousel = ({ images }) => {
  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {images.map((image, index) => (
        <Image key={index} source={{ uri: image }} style={styles.image} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "70%",
  },
  image: {
    width,
    height: "100%",
  },
});

export default ProfileCarousel;
