// src/components/SocialButton.tsx

import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Text } from "react-native-paper";

interface SocialButtonProps {
  provider: string;
  icon: string;
  onPress: () => void;
  color: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  icon,
  onPress,
  color,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Icon name={icon} size={20} color="#fff" />
      <Text style={styles.text}> {provider}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SocialButton;
