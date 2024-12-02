// src/components/FiltersModal.tsx

import React, { useState } from "react";
import {
  Modal,
  Portal,
  Button,
  Text,
  Checkbox,
  RadioButton,
  TextInput,
} from "react-native-paper";
import { StyleSheet, ScrollView, View } from "react-native";

interface FiltersModalProps {
  visible: boolean;
  onDismiss: () => void;
  onApply: (filters: any) => void;
}

const FiltersModal: React.FC<FiltersModalProps> = ({
  visible,
  onDismiss,
  onApply,
}) => {
  const [location, setLocation] = useState<string>("");
  const [ageRange, setAgeRange] = useState<{ min: number; max: number }>({
    min: 18,
    max: 60,
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const availableInterests = [
    "Hiking",
    "Photography",
    "Food",
    "Traveling",
    "Music",
    "Art",
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const applyFilters = () => {
    onApply({
      location,
      age: `${ageRange.min}-${ageRange.max}`,
      interests: selectedInterests,
    });
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <ScrollView>
          <Text variant="titleMedium" style={styles.title}>
            Filters
          </Text>

          <TextInput
            label="Location"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
            placeholder="Enter location"
          />

          <Text variant="bodyMedium" style={styles.subtitle}>
            Age Range
          </Text>
          <View style={styles.ageContainer}>
            <TextInput
              label="Min"
              value={ageRange.min.toString()}
              onChangeText={(text) =>
                setAgeRange((prev) => ({ ...prev, min: parseInt(text) || 18 }))
              }
              keyboardType="number-pad"
              style={styles.ageInput}
            />
            <TextInput
              label="Max"
              value={ageRange.max.toString()}
              onChangeText={(text) =>
                setAgeRange((prev) => ({ ...prev, max: parseInt(text) || 60 }))
              }
              keyboardType="number-pad"
              style={styles.ageInput}
            />
          </View>

          <Text variant="bodyMedium" style={styles.subtitle}>
            Interests
          </Text>
          {availableInterests.map((interest) => (
            <Checkbox.Item
              key={interest}
              label={interest}
              status={
                selectedInterests.includes(interest) ? "checked" : "unchecked"
              }
              onPress={() => toggleInterest(interest)}
            />
          ))}

          <Button
            mode="contained"
            onPress={applyFilters}
            style={styles.applyButton}
          >
            Apply Filters
          </Button>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    maxHeight: "80%",
  },
  title: {
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    marginBottom: 10,
  },
  ageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ageInput: {
    width: "45%",
  },
  applyButton: {
    marginTop: 20,
  },
});

export default FiltersModal;
