// src/screens/Profile/ProfileScreen.tsx
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { MainStackParamList } from "../../types/navigation";
import PhotoGallery from "./PhotoGallery";
import PersonalDetailsSection from "./PersonalDetailsSection";
import ThemeToggle from "../../components/common/ThemeToggle";
import { showInfoToast } from "../../utils/toast";

type ProfileScreenNavigationProp = NavigationProp<
  MainStackParamList,
  "Profile"
>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
    showInfoToast("Edit Profile", "Navigate to Edit Profile Screen");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PersonalDetailsSection />
      <PhotoGallery />
      <ThemeToggle />
      <Button
        mode="contained"
        onPress={handleEditProfile}
        style={styles.editButton}
        accessibilityLabel="Edit Profile Button"
      >
        Edit Profile
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  editButton: {
    marginTop: 20,
    borderRadius: 30,
    paddingVertical: 8,
  },
});

export default ProfileScreen;
