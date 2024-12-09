// src/screens/Auth/RegisterScreen.tsx
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

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "src/types/navigation";
import RegisterCard from "./../components/RegisterCard";

const { width, height } = Dimensions.get("window");

type NavigationProp = StackNavigationProp<AuthStackParamList, "Register">;

const landmarks = [
  require("../../assets/landmarks/eiffel_tower.jpg"),
  require("../../assets/landmarks/great_wall.jpg"),
  require("../../assets/landmarks/taj_mahal.jpg"),
  require("../../assets/landmarks/statue_of_liberty.jpg"),
];

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Swiper
        autoplay
        autoplayTimeout={5}
        showsPagination={false}
        loop
        style={styles.swiper}
        accessibilityLabel="Landmark Swiper"
      >
        {landmarks.map((image, index) => (
          <ImageBackground key={index} source={image} style={styles.image} />
        ))}
      </Swiper>
      <RegisterCard />
      <TouchableOpacity
        style={styles.switch}
        accessible
        accessibilityLabel="Navigate to Login"
      >
        <Text style={styles.switchText}>
          Already have an account?{" "}
          <Text
            style={styles.switchLink}
            onPress={() => navigation.navigate("Login")}
          >
            Login
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

export default RegisterScreen;
