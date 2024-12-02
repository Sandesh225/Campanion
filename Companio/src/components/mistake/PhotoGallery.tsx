import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { IconButton, FAB, Dialog, Portal, Button } from "react-native-paper";
import ImagePicker from "react-native-image-crop-picker";
import DraggableFlatList from "react-native-draggable-flatlist";

const PhotoGallery = ({
  photos,
  onAddPhoto,
  onDeletePhoto,
  onReorderPhotos,
}: any) => {
  const [photoList, setPhotoList] = useState(photos);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const pickPhoto = async () => {
    try {
      const image = await ImagePicker.openPicker({
        cropping: false,
        compressImageMaxWidth: 800,
        compressImageMaxHeight: 800,
        compressImageQuality: 0.8,
        mediaType: "photo",
        multiple: true,
        maxFiles: 8 - photoList.length,
      });

      const uris = image.map((img) => img.path);
      onAddPhoto(uris);
    } catch (error) {
      console.log("Image picker error:", error);
    }
  };

  const renderItem = ({ item, index, drag }) => (
    <TouchableOpacity
      onLongPress={drag}
      onPress={() => {
        setSelectedPhoto(item);
        setShowDialog(true);
      }}
    >
      <Image source={{ uri: item }} style={styles.photo} />
    </TouchableOpacity>
  );

  const handleDelete = () => {
    onDeletePhoto(selectedPhoto);
    setShowDialog(false);
  };

  return (
    <View style={styles.container}>
      <DraggableFlatList
        data={photoList}
        renderItem={renderItem}
        keyExtractor={(item, index) => `draggable-item-${index}`}
        onDragEnd={({ data }) => {
          setPhotoList(data);
          onReorderPhotos(data);
        }}
        numColumns={2}
      />
      {photoList.length < 8 && (
        <FAB
          style={styles.fab}
          small
          icon="plus"
          onPress={pickPhoto}
          label="Add Photo"
        />
      )}
      <Portal>
        <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
          <Dialog.Content>
            <Image source={{ uri: selectedPhoto }} style={styles.dialogImage} />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleDelete}>Delete</Button>
            <Button onPress={() => setShowDialog(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  photo: {
    width: "48%",
    height: 150,
    margin: "1%",
  },
  fab: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  dialogImage: {
    width: "100%",
    height: 300,
  },
});

export default PhotoGallery;
