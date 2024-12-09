// src/screens/Profile/PersonalDetailsSection.tsx

import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, IconButton, Button } from "react-native-paper";
import { useUpdateUserProfileMutation } from "../../services/api";
import { User } from "../../types/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { useAppDispatch } from "../../store/hooks";
import { setUser } from "../../slices/authSlice";

interface PersonalDetailsProps {
  user: User | undefined;
}

const PersonalDetailsSection: React.FC<PersonalDetailsProps> = ({ user }) => {
  const [bio, setBio] = useState<string>(user?.bio || "");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();
  const dispatch = useAppDispatch();

  const handleSave = async () => {
    try {
      const payload = {
        userId: user?.id || "",
        profile: {
          bio,
        },
      };
      const updatedData = await updateUserProfile(payload).unwrap();
      showSuccessToast("Bio updated successfully");
      setIsEditing(false);
      dispatch(setUser(updatedData.data));
    } catch (error: any) {
      showErrorToast(
        "Failed to update bio",
        error?.data?.message || "Please try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Bio</Text>
      {isEditing ? (
        <>
          <TextInput
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={3}
            mode="outlined"
            style={styles.bioInput}
            accessibilityLabel="Edit Bio"
          />
          <View style={styles.buttonRow}>
            <Button
              mode="contained"
              onPress={handleSave}
              loading={isLoading}
              disabled={isLoading}
              style={styles.saveButton}
            >
              Save
            </Button>
            <Button
              mode="text"
              onPress={() => setIsEditing(false)}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
          </View>
        </>
      ) : (
        <View style={styles.bioDisplay}>
          <Text style={styles.bioText}>{user?.bio || "No bio available."}</Text>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => setIsEditing(true)}
            accessibilityLabel="Edit Bio"
            accessibilityHint="Enables editing of bio"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  bioDisplay: {
    flexDirection: "row",
    alignItems: "center",
  },
  bioText: {
    flex: 1,
    fontSize: 14,
    color: "#555555",
  },
  bioInput: {
    backgroundColor: "#F5F5F5",
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  saveButton: {
    marginRight: 8,
  },
  cancelButton: {},
});

export default PersonalDetailsSection;
