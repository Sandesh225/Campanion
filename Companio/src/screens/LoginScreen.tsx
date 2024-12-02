import React from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import Swiper from "react-native-swiper";
import LoginCard from "../components/LoginCard";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const landmarks = [
  require("../assets/landmarks/eiffel_tower.jpg"),
  require("../assets/landmarks/great_wall.jpg"),
  require("../assets/landmarks/taj_mahal.jpg"),
  require("../assets/landmarks/statue_of_liberty.jpg"),
];

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Swiper
        autoplay
        autoplayTimeout={5}
        showsPagination={false}
        loop
        style={styles.swiper}
      >
        {landmarks.map((image, index) => (
          <ImageBackground key={index} source={image} style={styles.image} />
        ))}
      </Swiper>
      <LoginCard />
      <TouchableOpacity style={styles.switch}>
        <Text style={styles.switchText}>
          Don't have an account?{" "}
          <Text
            style={styles.switchLink}
            onPress={() => navigation.navigate("Register")}
          >
            Register
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  swiper: {
    flex: 1,
  },
  image: {
    width,
    height,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  switch: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
  },
  switchText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  switchLink: {
    color: "#FBBC05",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
