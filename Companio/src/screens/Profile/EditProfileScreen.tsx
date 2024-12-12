// src/components/profile/EditProfileScreen.tsx

import React, { useState, useCallback } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button } from "react-native-paper";
import { useFormik } from "formik";
import * as Yup from "yup";

import { setUser } from "../../features/authSlice";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import useAppDispatch from "../../hooks/useAppDispatch";
import { useUpdateUserProfileMutation } from "../../api/api";
import useAppSelector from "../../hooks/useAppSelector";
import FormikTextInput from "../../components/common/FormikTextInput";

const EditProfileSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  bio: Yup.string(),
  profilePictureUrl: Yup.string().url("Invalid URL"),
});

const EditProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();
  const user = useAppSelector((state) => state.auth.user);

  const formik = useFormik({
    initialValues: {
      username: user?.username || "",
      bio: user?.bio || "",
      profilePictureUrl: user?.profilePictureUrl || "",
    },
    validationSchema: EditProfileSchema,
    onSubmit: async (values) => {
      try {
        const response: any = await updateProfile(values).unwrap();
        if (response.data) {
          dispatch(setUser(response.data.user));
          showSuccessToast("Profile Updated", "Your profile has been updated.");
        }
      } catch (error: any) {
        showErrorToast(
          "Update Failed",
          error?.data?.message || "Unable to update profile."
        );
      }
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        Edit Profile
      </Text>
      <FormikTextInput
        name="username"
        label="Username"
        leftIcon="account"
        accessibilityLabel="Username Input"
      />
      <FormikTextInput
        name="bio"
        label="Bio"
        leftIcon="information"
        accessibilityLabel="Bio Input"
      />
      <FormikTextInput
        name="profilePictureUrl"
        label="Profile Picture URL"
        leftIcon="image"
        keyboardType="url"
        accessibilityLabel="Profile Picture URL Input"
      />
      <Button
        onPress={formik.handleSubmit}
        text="Save Changes"
        loading={isLoading}
        accessibilityLabel="Save Changes Button"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 32,
    fontWeight: "bold",
  },
});

export default EditProfileScreen;
