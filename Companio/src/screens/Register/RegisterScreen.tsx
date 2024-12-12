// src/screens/Register/RegisterScreen.tsx

import React, { useState, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useRegisterMutation } from "../../api/authApi";
import { storeTokens } from "../../utils/keychain";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { setTokens, setUser } from "../../features/authSlice";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { useNavigation } from "@react-navigation/native";
import { MainStackParamList } from "../../types/navigation";
import type { StackNavigationProp } from "@react-navigation/stack";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

type RegisterScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  "Register"
>;

const RegisterScreen: React.FC = () => {
  const [registerFn, { isLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const theme = useTheme();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = useCallback(async () => {
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
        navigation.navigate("Home");
      } else {
        showErrorToast("Registration Failed", "Unable to register.");
      }
    } catch (error: any) {
      showErrorToast(
        "Registration Error",
        error?.data?.message || "Please try again."
      );
    }
  }, [username, email, password, registerFn, dispatch, navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        Register
      </Text>
      <Input
        label="Username"
        value={username}
        onChangeText={setUsername}
        accessibilityLabel="Username Input"
        leftIcon="account"
      />
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        accessibilityLabel="Email Address Input"
        leftIcon="email"
      />
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        accessibilityLabel="Password Input"
        leftIcon="lock"
      />
      <Button
        onPress={handleRegister}
        text="Register"
        loading={isLoading}
        accessibilityLabel="Register Button"
      />
      <View style={styles.loginButtonContainer}>
        <Text>Already have an account? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Navigate to Login Screen"
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 32,
    fontWeight: "bold",
  },
  loginButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  loginText: {
    color: "#FFD700",
    fontWeight: "bold",
  },
});

export default RegisterScreen;
