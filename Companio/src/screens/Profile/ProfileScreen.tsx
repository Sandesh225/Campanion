// src/screens/Profile/ProfileScreen.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  FlatList,
} from "react-native";
import {
  Text,
  Avatar,
  Button,
  TextInput,
  Chip,
  useTheme,
} from "react-native-paper";
import { useAppSelector } from "../../store/hooks";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUploadProfilePictureMutation,
  useUploadTravelPhotoMutation,
  useDeleteTravelPhotoMutation,
  useLikeUserMutation,
} from "../../services/api";
import { UserProfile, Badge } from "../../types/api";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import { launchImageLibrary } from "react-native-image-picker";
import PhotoGallery from "./PhotoGallery";
import BadgeItem from "./BadgeItem";

const { width } = Dimensions.get("window");
const PHOTO_SIZE = (width - 60) / 3;

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const authUser = useAppSelector((state) => state.auth.user);
  const userId = authUser?.id || "";

  const { data, isLoading, error } = useGetUserProfileQuery(userId);
  const [updateProfile] = useUpdateUserProfileMutation();
  const [uploadProfilePicture] = useUploadProfilePictureMutation();
  const [uploadTravelPhoto] = useUploadTravelPhotoMutation();
  const [deleteTravelPhoto] = useDeleteTravelPhotoMutation();
  const [likeUser] = useLikeUserMutation();

  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [compatibility, setCompatibility] = useState<number>(85); // Placeholder for compatibility percentage

  useEffect(() => {
    if (data && data.success && data.data) {
      setProfileData(data.data);
      calculateCompatibility(data.data);
    }
  }, [data]);

  // Function to calculate compatibility percentage (placeholder logic)
  const calculateCompatibility = (profile: UserProfile) => {
    // Implement actual compatibility logic based on user data
    setCompatibility(Math.floor(Math.random() * 100)); // Random for demonstration
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleProfileUpdate = async () => {
    if (!profileData) return;
    try {
      await updateProfile({ userId, profile: profileData }).unwrap();
      showSuccessToast("Profile Updated", "Your profile has been updated.");
      setEditMode(false);
    } catch (err) {
      showErrorToast("Update Failed", "Unable to update profile.");
    }
  };

  const pickImage = async (type: "profile" | "travel") => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 0.7,
    });
    if (result.assets && result.assets.length > 0) {
      const { uri, fileName, type: mimeType } = result.assets[0];
      const file = {
        uri,
        name: fileName || "photo.jpg",
        type: mimeType || "image/jpeg",
      };

      try {
        if (type === "profile") {
          const response = await uploadProfilePicture({
            userId,
            file,
          }).unwrap();
          setProfileData((prev) => ({
            ...prev!,
            profilePictureUrl: response.data.profilePictureUrl,
          }));
          showSuccessToast("Profile Picture Updated");
        } else {
          const response = await uploadTravelPhoto({ userId, file }).unwrap();
          setProfileData((prev) => ({
            ...prev!,
            travelPhotos: response.data.travelPhotos,
          }));
          showSuccessToast("Travel Photo Uploaded");
        }
      } catch (err) {
        showErrorToast("Upload Failed", "Unable to upload photo.");
      }
    }
  };

  const handleDeletePhoto = async (photoUrl: string) => {
    Alert.alert("Delete Photo", "Are you sure you want to delete this photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTravelPhoto({ userId, photoUrl }).unwrap();
            setProfileData((prev) => ({
              ...prev!,
              travelPhotos: prev!.travelPhotos.filter(
                (url) => url !== photoUrl
              ),
            }));
            showSuccessToast("Photo Deleted");
          } catch (err) {
            showErrorToast("Deletion Failed", "Unable to delete photo.");
          }
        },
      },
    ]);
  };

  const toggleInterest = (interest: string) => {
    if (!editMode || !profileData) return;
    const updatedInterests = profileData.preferences.interests.includes(
      interest
    )
      ? profileData.preferences.interests.filter((i) => i !== interest)
      : [...profileData.preferences.interests, interest];
    setProfileData((prev) => ({
      ...prev!,
      preferences: { ...prev!.preferences, interests: updatedInterests },
    }));
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Icon name="account" size={100} color={theme.colors.primary} />
        <Text>Loading Profile...</Text>
      </View>
    );
  }

  if (error || !profileData) {
    return (
      <View style={styles.loadingContainer}>
        <Icon name="alert-circle" size={100} color="#ff4d4d" />
        <Text>Error loading profile.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => pickImage("profile")}
          accessibilityLabel="Change Profile Picture"
        >
          {profileData.profilePictureUrl ? (
            <Avatar.Image
              size={120}
              source={{ uri: profileData.profilePictureUrl }}
            />
          ) : (
            <Avatar.Icon size={120} icon="account" />
          )}
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          {editMode ? (
            <>
              <TextInput
                label="Full Name"
                value={profileData.fullName}
                onChangeText={(text) =>
                  setProfileData((prev) => ({
                    ...prev!,
                    fullName: text,
                  }))
                }
                style={styles.input}
                mode="outlined"
              />
              <TextInput
                label="Bio"
                value={profileData.bio}
                onChangeText={(text) =>
                  setProfileData((prev) => ({
                    ...prev!,
                    bio: text,
                  }))
                }
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={3}
              />
            </>
          ) : (
            <>
              <Text style={styles.fullName}>{profileData.fullName}</Text>
              <Text style={styles.tagline}>{profileData.bio}</Text>
            </>
          )}
        </View>
        <TouchableOpacity
          onPress={handleEditToggle}
          accessibilityLabel={editMode ? "Save Profile" : "Edit Profile"}
        >
          <Icon
            name={editMode ? "check" : "pencil"}
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Compatibility Section */}
      <View style={styles.compatibilityContainer}>
        <Icon name="heart" size={24} color="#FF6B6B" />
        <Text style={styles.compatibilityText}>
          Compatibility: {compatibility}%
        </Text>
      </View>

      {/* Travel Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Travel Preferences</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {profileData.preferences.travelStyles.map((style) => (
            <Chip
              key={style}
              style={styles.chip}
              selected={false}
              onPress={() => {
                // Implement functionality if needed
              }}
            >
              {style}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {/* Interests */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interests</Text>
        <View style={styles.interestsContainer}>
          {["Hiking", "Photography", "Foodie", "Music", "Art", "Culture"].map(
            (interest) => (
              <Chip
                key={interest}
                style={styles.chip}
                selected={profileData.preferences.interests.includes(interest)}
                onPress={() => toggleInterest(interest)}
                selectedColor="#6DD5FA"
                mode={editMode ? "outlined" : "flat"}
              >
                {interest}
              </Chip>
            )
          )}
        </View>
      </View>

      {/* Travel Photos */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Travel Photos</Text>
          {editMode && (
            <Button
              mode="contained"
              onPress={() => pickImage("travel")}
              icon="plus"
              style={styles.addButton}
              accessibilityLabel="Add Travel Photo"
            >
              Add
            </Button>
          )}
        </View>
        <PhotoGallery
          photos={profileData.travelPhotos}
          onDeletePhoto={handleDeletePhoto}
          editMode={editMode}
        />
      </View>

      {/* Badges */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Badges & Achievements</Text>
        <FlatList
          data={profileData.badges}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => <BadgeItem badge={item} />}
          keyExtractor={(item, index) => `${item.name}-${index}`}
        />
      </View>

      {/* Action Buttons */}
      {!editMode && (
        <View style={styles.actionButtonsContainer}>
          <Button
            mode="contained"
            onPress={() => {
              // Implement 'Request to Connect' functionality
              showSuccessToast(
                "Request Sent",
                "Your connection request has been sent."
              );
            }}
            icon="account-plus"
            style={styles.actionButton}
            accessibilityLabel="Request to Connect"
          >
            Request to Connect
          </Button>
          <Button
            mode="outlined"
            onPress={() => {
              // Implement 'Start Chat' functionality
              showSuccessToast(
                "Chat Started",
                "You can now chat with your companion."
              );
            }}
            icon="chat"
            style={styles.actionButton}
            accessibilityLabel="Start Chat"
          >
            Start Chat
          </Button>
        </View>
      )}

      {/* Save Button in Edit Mode */}
      {editMode && (
        <View style={styles.saveButtonContainer}>
          <Button
            mode="contained"
            onPress={handleProfileUpdate}
            icon="content-save"
            accessibilityLabel="Save Profile"
          >
            Save Profile
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  fullName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  tagline: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  input: {
    marginBottom: 10,
  },
  compatibilityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#E0F7FA",
    padding: 10,
    borderRadius: 10,
  },
  compatibilityText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#E0F7FA",
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  addButton: {
    backgroundColor: "#6DD5FA",
  },
  photo: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 10,
    margin: 5,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  saveButtonContainer: {
    marginTop: 10,
  },
});

export default ProfileScreen;
