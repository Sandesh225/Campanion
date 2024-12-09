// src/screens/Auth/RegisterScreen.tsx

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useRegisterMutation } from "../../services/authApi";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { MainStackParamList } from "../../types/navigation";
import useAuth from "../../hooks/useAuth";
import { showErrorToast } from "../../utils/toast";

type RegisterScreenNavigationProp = NavigationProp<
  MainStackParamList,
  "Register"
>;

const RegisterScreen: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [register, { isLoading }] = useRegisterMutation();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { setUser } = useAuth();

  const handleRegister = async (): Promise<void> => {
    try {
      const registerResponse = await register({
        username,
        email,
        password,
      }).unwrap();
      if (registerResponse.success) {
        setUser(registerResponse.data.user);
        // Navigation is handled by AuthProvider's state change
      } else {
        throw new Error(registerResponse.message || "Registration failed");
      }
    } catch (error: any) {
      showErrorToast(
        "Registration Failed",
        error.message || "Please try again."
      );
    }
  };

  const navigateToLogin = (event: GestureResponderEvent): void => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register for Companio</Text>
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />
      <Button
        mode="contained"
        onPress={handleRegister}
        loading={isLoading}
        disabled={isLoading}
        style={styles.button}
        uppercase={false}
      >
        Register
      </Button>
      <TouchableOpacity onPress={navigateToLogin}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#6200ee",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  link: {
    color: "#6200ee",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});

export default React.memo(RegisterScreen);
