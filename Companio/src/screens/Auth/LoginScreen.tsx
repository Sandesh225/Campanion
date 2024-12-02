// src/screens/Auth/LoginScreen.tsx

import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button, Text, Surface, ActivityIndicator } from "react-native-paper";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";

import FormikTextInput from "../../components/common/FormikTextInput";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { LoginResponse, ApiResponse } from "../../types/api";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";

type NavigationProps = NavigationProp<RootStackParamList, "Login">;

interface LoginValues {
  email: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProps>();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleLogin = async (
    values: LoginValues,
    actions: FormikHelpers<LoginValues>
  ) => {
    setLoading(true);
    try {
      const response = await api.post<ApiResponse<LoginResponse>>(
        "/auth/login",
        {
          email: values.email,
          password: values.password,
        }
      );

      if (response.data.success) {
        const { accessToken, refreshToken, userId } = response.data.data;
        await login(accessToken, refreshToken);
        Alert.alert("Success", "Logged in successfully!");
      } else {
        Alert.alert("Login Failed", response.data.message);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to log in. Please try again."
      );
    } finally {
      setLoading(false);
      actions.setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Surface style={styles.container}>
          <Text variant="headlineSmall" style={styles.title}>
            Login
          </Text>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ handleSubmit, isValid, isSubmitting }) => (
              <>
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
                  accessibilityLabel="Login"
                  accessibilityHint="Logs you into your account"
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
                <Button
                  mode="text"
                  onPress={() => navigation.navigate("Register")}
                  style={styles.registerButton}
                  accessibilityLabel="Navigate to Register"
                  accessibilityHint="Navigates to the registration screen"
                >
                  Don't have an account? Register
                </Button>
                <Button
                  mode="text"
                  onPress={() => navigation.navigate("ForgotPassword")}
                  style={styles.forgotButton}
                  accessibilityLabel="Navigate to Forgot Password"
                  accessibilityHint="Navigates to the forgot password screen"
                >
                  Forgot Password?
                </Button>
              </>
            )}
          </Formik>
        </Surface>
        {loading && (
          <ActivityIndicator
            size="large"
            color="#6200ee"
            style={styles.loader}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
  registerButton: {
    marginTop: 10,
  },
  forgotButton: {
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

export default LoginScreen;
