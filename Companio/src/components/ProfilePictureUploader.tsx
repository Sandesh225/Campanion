// src/components/ProfilePictureUploader.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Button } from "react-native-paper";
import {
  launchImageLibrary,
  ImageLibraryOptions,
  Asset,
} from "react-native-image-picker";
import { useMutation } from "@tanstack/react-query";
import api from "../services/api";
import { showToast } from "../utils/toast";
import type { ApiResponse, UploadProfilePictureResponse } from "../types/api";

const ProfilePictureUploader: React.FC<{
  currentPicture: string;
  onUpdate: (url: string) => void;
}> = ({ currentPicture, onUpdate }) => {
  const mutation = useMutation<
    ApiResponse<UploadProfilePictureResponse>, // TData
    Error, // TError
    FormData // TVariables
  >(
    (formData: FormData) =>
      api.post<ApiResponse<UploadProfilePictureResponse>>(
        "/users/profile/picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      ),
    {
      onSuccess: (data: ApiResponse<UploadProfilePictureResponse>) => {
        if (data.success) {
          showToast(
            "success",
            "Profile Picture Updated",
            data.message || "Profile picture updated successfully."
          );
          onUpdate(data.data.profilePictureUrl);
        } else {
          showToast(
            "error",
            "Update Failed",
            data.message || "Failed to update profile picture."
          );
        }
      },
      onError: () => {
        showToast(
          "error",
          "Upload Failed",
          "Unable to upload profile picture."
        );
      },
    }
  );

  const handleChoosePhoto = () => {
    const options: ImageLibraryOptions = {
      mediaType: "photo",
      quality: 0.7,
      selectionLimit: 1,
    };

    launchImageLibrary(options, async (response) => {
      if (response.assets && response.assets.length > 0) {
        const asset: Asset = response.assets[0];
        if (asset.uri && asset.type && asset.fileName) {
          const formData = new FormData();
          const file: any = {
            uri: asset.uri,
            type: asset.type,
            name: asset.fileName,
          };
          formData.append("profilePicture", file);
          mutation.mutate(formData);
        } else {
          showToast("error", "Invalid File", "The selected file is not valid.");
        }
      } else if (response.didCancel) {
        showToast("info", "Cancelled", "No file selected.");
      } else {
        showToast(
          "error",
          "Error",
          "An error occurred while selecting the file."
        );
      }
    });
  };

  return (
    <View style={styles.container}>
      <Avatar.Image
        size={100}
        source={{
          uri: currentPicture || "https://via.placeholder.com/100",
        }}
        style={styles.avatar}
      />
      <Button
        mode="contained"
        onPress={handleChoosePhoto}
        style={styles.button}
        loading={mutation.isLoading}
        disabled={mutation.isLoading}
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
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default ProfilePictureUploader;
