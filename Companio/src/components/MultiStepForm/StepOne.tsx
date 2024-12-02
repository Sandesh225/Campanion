// src/components/MultiStepForm/StepOne.tsx

import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Button, Text, ActivityIndicator } from "react-native-paper";
import { useFormikContext } from "formik";

import FormikTextInput from "../common/FormikTextInput";
import api from "../../services/api";
import type { FormData } from "../../types/form"; // Type-only import

interface StepOneProps {
  nextStep: () => void;
}

const StepOne: React.FC<StepOneProps> = ({ nextStep }) => {
  const {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    setFieldError,
    setFieldTouched,
  } = useFormikContext<FormData>();
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [checkingUsername, setCheckingUsername] = useState<boolean>(false);

  const checkUsername = useCallback(async () => {
    const username = values.basicInfo.username;
    if (username.length >= 3) {
      setCheckingUsername(true);
      try {
        const response = await api.get(`/users`, { params: { username } });
        // Assuming the API returns an array of users with that username
        if (response.data.success) {
          if (response.data.data.length > 0) {
            setUsernameAvailable(false);
            setFieldError("basicInfo.username", "Username is already taken");
          } else {
            setUsernameAvailable(true);
            setFieldError("basicInfo.username", undefined);
          }
        } else {
          setUsernameAvailable(false);
          setFieldError(
            "basicInfo.username",
            response.data.message || "Error checking username"
          );
        }
      } catch (error) {
        console.error("Username check error:", error);
        setUsernameAvailable(false);
        setFieldError("basicInfo.username", "Error checking username");
      } finally {
        setCheckingUsername(false);
      }
    } else {
      setUsernameAvailable(null);
      setFieldError("basicInfo.username", undefined);
    }
  }, [values.basicInfo.username, setFieldError]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      checkUsername();
    }, 500); // Debounce API calls by 500ms

    return () => clearTimeout(debounceTimeout);
  }, [checkUsername, values.basicInfo.username]);

  const handleNext = () => {
    if (usernameAvailable) {
      nextStep();
    } else {
      Alert.alert("Invalid Username", "Please choose a different username.");
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        Basic Information
      </Text>
      <FormikTextInput
        name="basicInfo.fullName"
        label="Full Name"
        placeholder="Enter your full name"
      />
      <FormikTextInput
        name="basicInfo.username"
        label="Username"
        placeholder="Choose a username"
      />
      {checkingUsername && <ActivityIndicator size="small" color="#6200ee" />}
      {usernameAvailable === false && touched.basicInfo?.username && (
        <Text style={styles.errorText}>Username is already taken</Text>
      )}
      <FormikTextInput
        name="basicInfo.email"
        label="Email"
        placeholder="Enter your email"
        keyboardType="email-address"
      />
      <Button
        mode="contained"
        onPress={handleNext}
        disabled={
          !isValid ||
          isSubmitting ||
          checkingUsername ||
          usernameAvailable === false
        }
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        Next
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    color: "#6200ee",
  },
  button: {
    marginTop: 20,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  errorText: {
    color: "red",
    marginTop: 5,
    marginBottom: 10,
  },
});

export default StepOne;
