// src/screens/Profile/EditProfileScreen.tsx

import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, TextInput, Button, Switch } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { ApiResponse, UserProfile } from "../../types/api";
import CustomAppBar from "../../components/Common/CustomAppBar";
import { showToast } from "../../utils/toast";

const EditProfileSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  bio: Yup.string(),
  preferences: Yup.object().shape({
    travelStyles: Yup.array().of(Yup.string()),
    interests: Yup.array().of(Yup.string()),
    activities: Yup.array().of(Yup.string()),
  }),
  settings: Yup.object().shape({
    privacy: Yup.string()
      .oneOf(["public", "private"])
      .required("Privacy setting is required"),
    notifications: Yup.object().shape({
      emailNotifications: Yup.boolean(),
      pushNotifications: Yup.boolean(),
    }),
  }),
});

const EditProfileScreen: React.FC = () => {
  const { userId } = useContext(AuthContext);
  const [initialValues, setInitialValues] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get<ApiResponse<UserProfile>>(
          `/users/${userId}`
        );
        if (response.data.success) {
          setInitialValues(response.data.data);
        } else {
          showToast("error", "Error", "Failed to load profile.");
        }
      } catch (error: any) {
        console.error("Profile fetch error:", error);
        showToast("error", "Error", "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleSubmit = async (values: any) => {
    try {
      const response = await api.put<ApiResponse<UserProfile>>(
        `/users/${userId}`,
        {
          profile: values.profile,
        }
      );

      if (response.data.success) {
        showToast("success", "Success", "Profile updated successfully.");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error("Profile update error:", error);
      showToast(
        "error",
        "Error",
        error.response?.data?.message || "Failed to update profile."
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!initialValues) {
    return (
      <View style={styles.container}>
        <CustomAppBar title="Edit Profile" canGoBack={true} />
        <Text>No profile data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomAppBar title="Edit Profile" canGoBack={true} />
      <ScrollView contentContainerStyle={styles.content}>
        <Formik
          initialValues={{
            fullName: initialValues.profile.fullName,
            bio: initialValues.profile.bio,
            preferences: initialValues.profile.preferences,
            settings: initialValues.profile.settings,
          }}
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
          }) => (
            <View>
              <TextInput
                label="Full Name"
                mode="outlined"
                onChangeText={handleChange("fullName")}
                onBlur={handleBlur("fullName")}
                value={values.fullName}
                error={touched.fullName && !!errors.fullName}
                style={styles.input}
              />
              {touched.fullName && errors.fullName && (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              )}

              <TextInput
                label="Bio"
                mode="outlined"
                onChangeText={handleChange("bio")}
                onBlur={handleBlur("bio")}
                value={values.bio}
                error={touched.bio && !!errors.bio}
                style={styles.input}
                multiline
              />
              {touched.bio && errors.bio && (
                <Text style={styles.errorText}>{errors.bio}</Text>
              )}

              {/* Preferences Section */}
              <Text style={styles.sectionTitle}>Preferences</Text>
              {/* Implement preference inputs as needed */}

              {/* Settings Section */}
              <Text style={styles.sectionTitle}>Settings</Text>
              <View style={styles.switchContainer}>
                <Text>Privacy: {values.settings.privacy}</Text>
                <Button
                  mode="outlined"
                  onPress={() =>
                    handleChange("settings.privacy")(
                      values.settings.privacy === "public"
                        ? "private"
                        : "public"
                    )
                  }
                >
                  Toggle
                </Button>
              </View>
              <View style={styles.switchContainer}>
                <Text>Email Notifications</Text>
                <Switch
                  value={values.settings.notifications.emailNotifications}
                  onValueChange={handleChange(
                    "settings.notifications.emailNotifications"
                  )}
                />
              </View>
              <View style={styles.switchContainer}>
                <Text>Push Notifications</Text>
                <Switch
                  value={values.settings.notifications.pushNotifications}
                  onValueChange={handleChange(
                    "settings.notifications.pushNotifications"
                  )}
                />
              </View>

              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
              >
                Save Changes
              </Button>
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
  },
  input: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginVertical: 10,
    fontFamily: "Poppins_700Bold",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
  errorText: {
    color: "red",
    marginBottom: 5,
    fontFamily: "Poppins_400Regular",
  },
});

export default EditProfileScreen;
