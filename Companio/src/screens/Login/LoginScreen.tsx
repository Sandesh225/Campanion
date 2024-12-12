// src/screens/Auth/LoginScreen.tsx
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useLoginMutation } from "../../api/apiSlice"; // Updated import
import useAppDispatch from "../../hooks/useAppDispatch";
import { setTokens, setUser } from "../../store/slices/authSlice";
import { storeTokens } from "../../utils/keychain";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../../types/navigation";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

type LoginScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  "Login"
>;

const LoginScreen: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showErrorToast("Input Error", "Email and password are required.");
      return;
    }

    try {
      const response = await login({ email, password }).unwrap();
      console.log("Login Response:", response);
      const { accessToken, refreshToken, user } = response.data;

      if (!accessToken || !refreshToken || !user) {
        showErrorToast("Login Error", "Incomplete login response.");
        return;
      }

      await storeTokens(accessToken, refreshToken);
      console.log("Tokens stored successfully.");

      dispatch(setTokens({ accessToken, refreshToken }));
      dispatch(setUser(user));
      showSuccessToast("Login Successful", `Welcome back, ${user.username}!`);
      navigation.replace("Home");
    } catch (error: any) {
      console.log("Login Error:", error);
      const errorMessage =
        error?.data?.message || "Login failed. Please try again.";
      showErrorToast("Login Error", errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Text style={styles.title}>{t("login")}</Text>
        <TextInput
          label={t("email")}
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          mode="outlined"
          accessibilityLabel="Email Input"
        />
        <TextInput
          label={t("password")}
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          style={styles.input}
          mode="outlined"
          accessibilityLabel="Password Input"
        />
        <Button
          mode="contained"
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
          accessibilityLabel="Login Button"
        >
          {t("login")}
        </Button>
        <Button
          mode="text"
          onPress={() => navigation.navigate("Register")}
          style={styles.link}
          accessibilityLabel="Navigate to Register Button"
        >
          {t("don't_have_account")} Register
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  innerContainer: {
    flexGrow: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  link: {
    marginTop: 16,
    alignSelf: "center",
  },
});

export default LoginScreen;
