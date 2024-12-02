import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Avatar } from "react-native-paper";
import {
  launchImageLibrary,
  ImageLibraryOptions,
  Asset,
} from "react-native-image-picker";
import { useUploadProfilePictureMutation } from "../services/userApi";
import { showToast } from "../utils/toast"; // Replace with your toast utility

const ProfilePictureUploader: React.FC = () => {
  const [uploadProfilePicture] = useUploadProfilePictureMutation();

  const handleChoosePhoto = () => {
    const options: ImageLibraryOptions = {
      mediaType: "photo",
      quality: 0.5,
      selectionLimit: 1,
    };

    launchImageLibrary(options, async (response) => {
      if (response.assets && response.assets.length > 0) {
        const asset: Asset = response.assets[0]; // Access the first selected asset
        if (asset.uri && asset.type && asset.fileName) {
          const formData = new FormData();
          formData.append("profilePicture", {
            uri: asset.uri,
            type: asset.type,
            name: asset.fileName,
          });

          try {
            const result = await uploadProfilePicture(formData).unwrap();
            showToast(
              "success",
              "Profile Picture Updated",
              "Your profile picture has been updated successfully."
            );
          } catch (err) {
            console.error("Failed to upload profile picture:", err);
            showToast(
              "error",
              "Upload Failed",
              "There was an issue uploading your profile picture."
            );
          }
        } else {
          showToast("error", "Invalid File", "The selected file is not valid.");
        }
      } else {
        showToast("info", "No Selection", "No file was selected.");
      }
    });
  };

  return (
    <View style={styles.container}>
      <Avatar.Image
        size={100}
        source={{
          uri: "https://via.placeholder.com/100", // Replace with the user's profile picture URL from the server
        }}
        style={styles.avatar}
      />
      <Button
        mode="contained"
        onPress={handleChoosePhoto}
        style={styles.button}
      >
        Change Profile Picture
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
  },
  avatar: {
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
});

export default ProfilePictureUploader;
