// src/screens/Home/HeaderSection.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import useAppSelector from "../../hooks/useAppSelector";
import { selectAuthUser } from "../../store/selectors/authSelectors"; // Correct import
import { useTranslation } from "react-i18next";

const HeaderSection: React.FC = () => {
  const user = useAppSelector(selectAuthUser);
  const { t } = useTranslation();

  if (!user) {
    return null;
  }

  const profilePictureUrl =
    user.profilePictureUrl || "https://via.placeholder.com/150"; // Use user’s actual picture if available

  return (
    <View style={styles.headerContainer}>
      <Icon name="alpha-h-circle" size={30} color="#6200ee" />
      <View style={styles.greetingContainer}>
        <Text variant="titleMedium">{t("welcome")},</Text>
        <Text variant="headlineMedium" style={styles.username}>
          {user.username}!
        </Text>
      </View>
      <Avatar.Image
        size={40}
        source={{
          uri: profilePictureUrl,
        }}
        accessible={true}
        accessibilityLabel={t("user_profile_picture")}
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
    backgroundColor: "#FFFFFF",
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
