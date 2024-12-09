// src/components/Home/Header.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../../slices/authSlice";

const HeaderSection: React.FC = () => {
  const user = useSelector(selectAuthUser);

  return (
    <View style={styles.headerContainer}>
      <Icon name="alpha-h-circle" size={30} color="#6200ee" />
      <View style={styles.greetingContainer}>
        <Text variant="titleMedium">Welcome back,</Text>
        <Text variant="headlineMedium" style={styles.username}>
          {user?.username}!
        </Text>
      </View>
      <Avatar.Image
        size={40}
        source={{
          uri: user?.profilePictureUrl || "https://via.placeholder.com/150",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },
  greetingContainer: {
    flex: 1,
    marginLeft: 16,
  },
  username: {
    fontWeight: "bold",
  },
});

export default React.memo(HeaderSection);
