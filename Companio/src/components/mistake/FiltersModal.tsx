import React from "react";
import { Modal, View, StyleSheet } from "react-native";
import { Button, Text, Slider, Checkbox } from "react-native-paper";

const FiltersModal = ({ visible, onClose, onApply }) => {
  const [distance, setDistance] = React.useState(50);
  const [ageRange, setAgeRange] = React.useState([18, 30]);
  const [interests, setInterests] = React.useState([]);

  const handleApply = () => {
    onApply({ distance, ageRange, interests });
    onClose();
  };

  return (
    <Modal visible={visible} onDismiss={onClose}>
      <View style={styles.container}>
        <Text variant="headlineMedium">Filters</Text>
        {/* Add sliders and checkboxes for filters */}
        <Button onPress={handleApply}>Apply</Button>
        <Button onPress={onClose}>Cancel</Button>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
});

export default FiltersModal;
