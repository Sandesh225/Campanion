import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Avatar, IconButton, Button } from "react-native-paper";
import ImagePicker from "react-native-image-crop-picker"; // Use this library for cropping

const ProfilePicture = ({ profilePictureUrl, onUpload }) => {
  const [previewUri, setPreviewUri] = useState(null);

  const pickImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        compressImageMaxWidth: 800,
        compressImageMaxHeight: 800,
        compressImageQuality: 0.8,
        mediaType: "photo",
      });

      setPreviewUri(image.path);
    } catch (error) {
      console.log("Image picker error:", error);
    }
  };

  const handleUpload = () => {
    if (previewUri) {
      onUpload(previewUri);
      setPreviewUri(null);
    }
  };

  return (
    <View style={styles.container}>
      {previewUri ? (
        <Image source={{ uri: previewUri }} style={styles.previewImage} />
      ) : (
        <Avatar.Image
          size={100}
          source={{
            uri: profilePictureUrl || "https://via.placeholder.com/100",
          }}
        />
      )}
      <IconButton
        icon="camera"
        size={24}
        style={styles.cameraIcon}
        onPress={pickImage}
      />
      {previewUri && (
        <Button
          mode="contained"
          onPress={handleUpload}
          style={styles.uploadButton}
        >
          Save Picture
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  uploadButton: {
    marginTop: 10,
  },
});

export default ProfilePicture;
