// src/screens/Auth/LoginScreen.tsx

import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useLoginMutation } from "../services/authApi";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../hooks/useAuth";
import Toast from "react-native-toast-message";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const navigation = useNavigation();
  const { setUser } = useAuth();

  const handleLogin = async () => {
    try {
      const authData = await login({ email, password }).unwrap();
      setUser(authData.user);
      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: `Welcome back, ${authData.user.username}!`,
      });
      // Navigation is handled by AuthProvider's state change
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error.message || "Please try again.",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to Companio</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        loading={isLoading}
        disabled={isLoading}
        style={styles.button}
      >
        Login
      </Button>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Don't have an account? Register</Text>
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
  },
  link: {
    color: "#6200ee",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
