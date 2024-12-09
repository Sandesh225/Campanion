// src/components/Profile/PhotoGallery.tsx

import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { IconButton } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface PhotoGalleryProps {
  photos: string[];
  onDeletePhoto: (photoUrl: string) => void;
  editMode: boolean;
}

const { width } = Dimensions.get("window");
const PHOTO_SIZE = (width - 60) / 3;

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  onDeletePhoto,
  editMode,
}) => {
  const handleLongPress = (photoUrl: string) => {
    if (editMode) {
      Alert.alert(
        "Delete Photo",
        "Are you sure you want to delete this photo?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => onDeletePhoto(photoUrl),
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      {photos.map((photoUrl) => (
        <TouchableOpacity
          key={photoUrl}
          onPress={() => {
            // Implement image preview if needed
          }}
          onLongPress={() => handleLongPress(photoUrl)}
          accessibilityLabel="View Photo"
        >
          <Image source={{ uri: photoUrl }} style={styles.photo} />
          {editMode && (
            <IconButton
              icon="delete-circle"
              size={24}
              style={styles.deleteIcon}
              onPress={() => onDeletePhoto(photoUrl)}
              accessibilityLabel="Delete Photo"
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  photo: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 10,
    margin: 5,
  },
  deleteIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 12,
  },
});

export default PhotoGallery;
