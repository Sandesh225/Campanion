// src/screens/RegisterScreen.tsx

import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useRegisterMutation } from "../api/authApi";
import { storeTokens } from "../utils/keychain";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { setTokens, setUser } from "../features/authSlice"; // Import setUser
import { showErrorToast, showSuccessToast } from "../utils/toast";
import { useNavigation } from "@react-navigation/native";
import { MainStackParamList } from "../types/navigation";
import type { StackNavigationProp } from "@react-navigation/stack";

type RegisterScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  "Register"
>;

export const RegisterScreen = () => {
  const [registerFn, { isLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<RegisterScreenNavigationProp>(); // Use useNavigation hook

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res: any = await registerFn({ username, email, password }).unwrap();
      if (res.data) {
        const { accessToken, refreshToken, user } = res.data;
        await storeTokens(accessToken, refreshToken);
        dispatch(setTokens({ accessToken, refreshToken }));
        dispatch(setUser(user));
        showSuccessToast(
          "Registration Successful",
          `Welcome, ${user.username}!`
        );
      } else {
        showErrorToast("Registration Failed", "Unable to register.");
      }
    } catch (error: any) {
      showErrorToast(
        "Registration Error",
        error?.data?.message || "Please try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        Register
      </Text>
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        style={styles.input}
      />
      <Button mode="contained" onPress={handleRegister} loading={isLoading}>
        Register
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate("Login")} // Use navigation
        style={styles.loginButton}
      >
        Already have an account? Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: { marginBottom: 20, textAlign: "center" },
  input: { marginBottom: 10 },
  loginButton: { marginTop: 10 },
});
