// src/screens/Profile/EditProfileScreen.tsx

import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";
import PageLayout from "../../components/common/PageLayout";
import { Formik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { User, ApiResponse } from "../../types";
import { showToast } from "../../utils/toast";

interface EditProfileFormValues {
  bio: string;
  // Add other editable fields as needed
}

const EditProfileSchema = Yup.object().shape({
  bio: Yup.string().max(150, "Bio must not exceed 150 characters"),
  // Add validations for other fields
});

const EditProfileScreen: React.FC = () => {
  const { user, setUser } = useContext(AuthContext); // Ensure setUser is available in AuthContext
  const initialValues: EditProfileFormValues = {
    bio: user?.bio || "",
    // Initialize other fields
  };

  const handleSubmit = async (
    values: EditProfileFormValues,
    { setSubmitting }: any
  ) => {
    try {
      const response = await api.put<ApiResponse<User>>(`/users/${user?.id}`, {
        bio: values.bio,
        // Include other fields
      });

      if (response.data.success) {
        showToast(
          "success",
          "Profile Updated",
          "Your profile has been updated."
        );
        // Update user in context
        setUser(response.data.data);
      } else {
        showToast(
          "error",
          "Update Failed",
          response.data.message || "Failed to update profile."
        );
      }
    } catch (error: any) {
      console.error("Update profile error:", error);
      showToast(
        "error",
        "Update Failed",
        error.message || "Failed to update profile."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout title="Edit Profile">
      <View style={styles.container}>
        <Formik
          initialValues={initialValues}
          validationSchema={EditProfileSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <View>
              <TextInput
                label="Bio"
                mode="outlined"
                onChangeText={handleChange("bio")}
                onBlur={handleBlur("bio")}
                value={values.bio}
                multiline
                numberOfLines={4}
                error={touched.bio && !!errors.bio}
                style={styles.input}
              />
              {touched.bio && errors.bio && (
                <HelperText type="error">{errors.bio}</HelperText>
              )}

              {/* Add other input fields here */}

              <Button
                mode="contained"
                onPress={handleSubmit}
                disabled={isSubmitting}
                style={styles.button}
              >
                {isSubmitting ? "Updating..." : "Update Profile"}
              </Button>
            </View>
          )}
        </Formik>
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginVertical: 5,
  },
  button: {
    marginTop: 10,
  },
});

export default EditProfileScreen;
