// src/components/MultiStepForm/ProfileWizard.tsx

import React, { useState, useContext, useCallback } from "react";
import { StyleSheet, Alert, ScrollView, View } from "react-native";
import { Button, Surface, Text } from "react-native-paper";
import { Formik, FormikHelpers } from "formik";
import ProgressIndicator from "../common/ProgressIndicator";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import Completion from "./Completion";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import {
  ApiResponse,
  UpdateProfileResponse,
  UploadProfilePictureResponse,
  User,
} from "../../types/api";
import type { FormData } from "../../types/form"; // Type-only import
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import { showToast } from "../../utils/toast";

const initialValues: FormData = {
  basicInfo: {
    fullName: "",
    username: "",
    email: "",
  },
  preferences: {
    travelStyles: [],
    interests: [],
    activities: [],
  },
  settings: {
    privacy: "public",
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
    },
  },
  profilePicture: null,
  profilePictureUrl: "",
  bio: "",
  participants: [], // Added participants
};

const ProfileWizard: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 5; // Including Completion step
  const { user, setUser } = useContext(AuthContext);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const nextStep = useCallback(
    () => setStep((prev) => Math.min(prev + 1, totalSteps)),
    [totalSteps]
  );
  const prevStep = useCallback(
    () => setStep((prev) => Math.max(prev - 1, 1)),
    []
  );

  const handleSubmit = useCallback(
    async (values: FormData, actions: FormikHelpers<FormData>) => {
      if (!user) {
        showToast("info", "User not authenticated.");
        return;
      }

      try {
        // Upload profile picture if exists
        if (values.profilePicture) {
          const formData = new FormData();
          formData.append("profilePicture", {
            uri: values.profilePicture.uri,
            type: values.profilePicture.type,
            name: values.profilePicture.name,
          });

          const uploadResponse = await api.post<
            ApiResponse<UploadProfilePictureResponse>
          >(`/users/${user.id}/profile/picture`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (uploadResponse.data.success) {
            values.profilePictureUrl =
              uploadResponse.data.data.profilePictureUrl;
          } else {
            throw new Error(uploadResponse.data.message);
          }
        }

        // Submit profile data
        const profileData = {
          profile: {
            fullName: values.basicInfo.fullName,
            username: values.basicInfo.username,
            bio: values.bio,
            preferences: values.preferences,
            settings: values.settings,
            profilePictureUrl: values.profilePictureUrl || "",
          },
        };

        const response = await api.put<ApiResponse<User>>(
          `/users/${user.id}`,
          profileData
        );

        if (response.data.success) {
          showToast("success", "Success", "Profile created successfully!");
          setUser(response.data.data); // Now response.data.data is of type User
          nextStep();
        } else {
          throw new Error(response.data.message);
        }
      } catch (error: any) {
        console.error("Profile submission error:", error);
        showToast(
          "error",
          "Profile Creation Failed",
          error.message || "Failed to create profile. Please try again."
        );
      } finally {
        actions.setSubmitting(false);
      }
    },
    [user, nextStep, setUser]
  );

  const handleSkip = useCallback(() => {
    Alert.alert(
      "Skip Profile Setup",
      "Are you sure you want to skip setting up your profile?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            nextStep();
          },
        },
      ]
    );
  }, [nextStep]);

  const renderStep = useCallback(() => {
    switch (step) {
      case 1:
        return <StepOne nextStep={nextStep} />;
      case 2:
        return <StepTwo nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <StepThree nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        return <Completion />;
      case 5:
        return (
          <View style={styles.skipContainer}>
            <Text style={styles.skipText}>
              You've completed the profile setup!
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("Dashboard")}
              style={styles.button}
            >
              Go to Dashboard
            </Button>
          </View>
        );
      default:
        return <StepOne nextStep={nextStep} />;
    }
  }, [step, nextStep, prevStep, navigation]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Surface style={styles.container}>
        <ProgressIndicator currentStep={step} totalSteps={totalSteps} />
        <Formik<FormData> initialValues={initialValues} onSubmit={handleSubmit}>
          {({ handleSubmit, isValid, isSubmitting }) => (
            <>
              {renderStep()}
              {step < 4 && (
                <Button onPress={handleSkip} style={styles.skipButton}>
                  Skip
                </Button>
              )}
            </>
          )}
        </Formik>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    padding: 20,
    margin: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 4,
  },
  skipButton: {
    marginTop: 10,
    backgroundColor: "#9E9E9E",
  },
  skipContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  skipText: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    width: "60%",
  },
});

export default ProfileWizard;
