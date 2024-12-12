// src/screens/LoginScreen.tsx

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  useTheme,
  Switch,
  IconButton,
} from "react-native-paper";
import { useLoginMutation } from "../api/authApi";
import { storeTokens } from "../utils/keychain";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { setTokens, setUser } from "../features/authSlice";
import { showErrorToast, showSuccessToast } from "../utils/toast";
import { useNavigation } from "@react-navigation/native";
import { MainStackParamList } from "../types/navigation";
import type { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-toast-message";

type LoginScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  "Login"
>;

export const LoginScreen = () => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en"); // Default language

  const handleLogin = async () => {
    try {
      const res: any = await login({ email, password }).unwrap();
      if (res.data) {
        const { accessToken, refreshToken, user } = res.data;
        await storeTokens(accessToken, refreshToken);
        dispatch(setTokens({ accessToken, refreshToken }));
        dispatch(setUser(user));
        showSuccessToast("Login Successful", `Welcome back, ${user.username}!`);
      } else {
        showErrorToast("Login Failed", "Invalid credentials.");
      }
    } catch (error: any) {
      showErrorToast(
        "Login Error",
        error?.data?.message || "Please try again."
      );
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Implement dark mode toggle logic here
    // This could involve updating the theme in your PaperProvider
  };

  const handleLanguageChange = () => {
    // Implement language change logic here
    // This could involve integrating with a localization library like i18n
    // For demonstration, we'll toggle between English and Arabic (RTL)
    if (language === "en") {
      setLanguage("ar");
      I18nManager.forceRTL(true);
    } else {
      setLanguage("en");
      I18nManager.forceRTL(false);
    }
    // Reload the app to apply RTL changes
    // This typically requires restarting the app
  };

  const handleSocialLogin = (provider: string) => {
    // Implement social login logic here
    showSuccessToast("Social Login", `Logging in with ${provider}`);
  };

  return (
    <ImageBackground
      source={require("../assets/congratulations.json")} // Replace with your background image
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/animations/login.json")} // Replace with your app logo
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.slogan}>Connect. Explore. Belong.</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            left={<TextInput.Icon name="email" />}
          />
          <TextInput
            label="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon name="lock" />}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          >
            Log In
          </Button>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>Or Login With</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialButtonsContainer}>
          <Button
            mode="outlined"
            icon={() => <Icon name="google" size={20} color="#DB4437" />}
            style={styles.socialButton}
            onPress={() => handleSocialLogin("Google")}
          >
            Google
          </Button>
          <Button
            mode="outlined"
            icon={() => <Icon name="facebook" size={20} color="#4267B2" />}
            style={styles.socialButton}
            onPress={() => handleSocialLogin("Facebook")}
          >
            Facebook
          </Button>
          <Button
            mode="outlined"
            icon={() => <Icon name="apple" size={20} color="#000000" />}
            style={styles.socialButton}
            onPress={() => handleSocialLogin("Apple")}
          >
            Apple
          </Button>
        </View>

        <View style={styles.signupContainer}>
          <Text>New here? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.signupText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsContainer}>
          <TouchableOpacity onPress={handleLanguageChange}>
            <Text style={styles.languageText}>
              {language === "en" ? "English" : "العربية"}
            </Text>
          </TouchableOpacity>
          <View style={styles.darkModeContainer}>
            <Text>Dark Mode</Text>
            <Switch value={darkMode} onValueChange={toggleDarkMode} />
          </View>
        </View>
      </View>
      <Toast />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent overlay for better readability
    padding: 20,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  slogan: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  forgotPassword: {
    color: "#FFD700",
    textAlign: "right",
    marginBottom: 10,
  },
  loginButton: {
    padding: 5,
    borderRadius: 30,
    backgroundColor: "#FFD700",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#FFFFFF",
  },
  orText: {
    marginHorizontal: 10,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  socialButton: {
    flex: 1,
    marginHorizontal: 5,
    borderColor: "#FFFFFF",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  signupText: {
    color: "#FFD700",
    fontWeight: "bold",
  },
  settingsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  languageText: {
    color: "#FFFFFF",
    textDecorationLine: "underline",
  },
  darkModeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default LoginScreen;
