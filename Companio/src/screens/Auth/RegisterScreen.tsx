// src/screens/Auth/RegisterScreen.tsx

import React, { useContext, useState } from "react";
import { StyleSheet, Alert, ScrollView } from "react-native";
import { Button, Text, Surface, ActivityIndicator } from "react-native-paper";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";

import FormikTextInput from "../../components/common/FormikTextInput";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { RegisterResponse, ApiResponse } from "../../types/api";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";

type NavigationProps = NavigationProp<RootStackParamList, "Register">;

interface RegisterValues {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

const RegisterScreen: React.FC = () => {
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProps>();

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full Name is required"),
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])/,
        "Password must include one uppercase letter, one lowercase letter, one number, and one special character"
      )
      .required("Password is required"),
  });

  const handleRegister = async (
    values: RegisterValues,
    actions: FormikHelpers<RegisterValues>
  ) => {
    setLoading(true);
    try {
      const response = await api.post<ApiResponse<RegisterResponse>>(
        "/auth/register",
        {
          username: values.username,
          email: values.email,
          password: values.password,
          profile: {
            fullName: values.fullName,
          },
        }
      );

      if (response.data.success) {
        const { accessToken, refreshToken, userId } = response.data.data;
        await login(accessToken, refreshToken);
        Alert.alert("Success", "Registration successful!");
      } else {
        Alert.alert("Registration Failed", response.data.message);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
      actions.setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Surface style={styles.container}>
        <Text variant="headlineSmall" style={styles.title}>
          Register
        </Text>
        <Formik
          initialValues={{
            fullName: "",
            username: "",
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {({ handleSubmit, isValid, isSubmitting }) => (
            <>
              <FormikTextInput
                name="fullName"
                label="Full Name"
                placeholder="Enter your full name"
              />
              <FormikTextInput
                name="username"
                label="Username"
                placeholder="Choose a username"
              />
              <FormikTextInput
                name="email"
                label="Email"
                placeholder="Enter your email"
                keyboardType="email-address"
              />
              <FormikTextInput
                name="password"
                label="Password"
                placeholder="Enter your password"
                secureTextEntry
              />
              <Button
                mode="contained"
                onPress={handleSubmit}
                disabled={!isValid || isSubmitting || loading}
                style={styles.button}
                contentStyle={styles.buttonContent}
                accessibilityLabel="Register"
                accessibilityHint="Creates a new user account with the provided information"
              >
                {loading ? "Registering..." : "Register"}
              </Button>
              <Button
                mode="text"
                onPress={() => navigation.navigate("Login")}
                style={styles.loginButton}
                accessibilityLabel="Navigate to Login"
                accessibilityHint="Navigates to the login screen"
              >
                Already have an account? Login
              </Button>
            </>
          )}
        </Formik>
      </Surface>
      {loading && (
        <ActivityIndicator size="large" color="#6200ee" style={styles.loader} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
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
  loginButton: {
    marginTop: 10,
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -18,
    marginTop: -18,
  },
});

export default RegisterScreen;
