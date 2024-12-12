// src/components/profile/PersonalDetailsSection.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Avatar } from "react-native-paper";
import useAppSelector from "../../hooks/useAppSelector";
import { selectAuthUser } from "../../store/slices/authSlice";
import { useTranslation } from "react-i18next";

const PersonalDetailsSection: React.FC = () => {
  const user = useAppSelector(selectAuthUser);
  const { t } = useTranslation();

  if (!user) {
    // Optionally, render a placeholder or nothing
    return null;
  }

  return (
    <View style={styles.container}>
      <Avatar.Image
        size={100}
        source={{
          uri: user.profilePictureUrl || "https://via.placeholder.com/150",
        }}
        accessible={true}
        accessibilityLabel={t("user_profile_picture")}
      />
      <Text style={styles.username}>{user.username}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.bio}>{user.bio || t("no_bio_available")}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  email: {
    fontSize: 16,
    color: "#666666",
    marginTop: 4,
  },
  bio: {
    fontSize: 14,
    color: "#999999",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 16,
  },
});

export default React.memo(PersonalDetailsSection);
