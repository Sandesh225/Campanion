// src/components/profile/PhotoGallery.tsx

import React from "react";
import { View, StyleSheet, Image, FlatList } from "react-native";
import useAppSelector from "../../hooks/useAppSelector";
import { selectAuthUser } from "../../features/authSlice";

const PhotoGallery: React.FC = () => {
  const user = useAppSelector(selectAuthUser);
  const photos = user?.profilePictureUrl
    ? [user.profilePictureUrl]
    : ["https://via.placeholder.com/150"];

  const renderItem = ({ item }: { item: string }) => (
    <Image source={{ uri: item }} style={styles.photo} />
  );

  return (
    <FlatList
      data={photos}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item}-${index}`}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.gallery}
      accessibilityLabel="Photo Gallery"
    />
  );
};

const styles = StyleSheet.create({
  gallery: {
    marginVertical: 16,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
});

export default React.memo(PhotoGallery);
