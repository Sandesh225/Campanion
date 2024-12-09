import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useLoginMutation } from "../../services/api";
import { useNavigation } from "@react-navigation/native";
import { MainStackParamList } from "../../types/navigation";
import { showErrorToast } from "../../utils/toast";
import type { NavigationProp } from "@react-navigation/native";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [login, { isLoading }] = useLoginMutation();
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();

  const handleLogin = async () => {
    try {
      await login({ email, password }).unwrap();
      // If successful, user state is handled in RTK. Navigation will switch to Home.
    } catch (error: any) {
      showErrorToast(
        "Login Failed",
        error?.data?.message || "Please try again."
      );
    }
  };

  const navigateToRegister = (): void => {
    navigation.navigate("Register");
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
        onPress={handleLogin}
        loading={isLoading}
        disabled={isLoading}
        style={styles.button}
      >
        Login
      </Button>
      <TouchableOpacity onPress={navigateToRegister}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(LoginScreen);

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
  input: { marginBottom: 16 },
  button: { marginBottom: 16, paddingVertical: 8 },
  link: {
    color: "#6200ee",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
