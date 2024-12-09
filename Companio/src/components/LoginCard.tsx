import React, { useState, useContext } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { AuthContext } from "../context/AuthContext";
import { Formik } from "formik";
import * as Yup from "yup";
import * as Animatable from "react-native-animatable";
import PlaneAnimation from "./PlaneAnimation";

const LoginCard: React.FC = () => {
  const { login } = useContext(AuthContext);
  const [showPlane, setShowPlane] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      await login(values.email, values.password);
      setShowPlane(true);
      setTimeout(() => setShowPlane(false), 3000);
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Please try again.");
    }
  };

  return (
    <View style={styles.card}>
      <Animatable.Text animation="bounceIn" duration={1500} style={styles.logo}>
        🧭 Companio
      </Animatable.Text>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <>
            <TextInput
              label="Email"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              mode="outlined"
              keyboardType="email-address"
              error={!!(errors.email && touched.email)}
              style={styles.input}
            />
            <TextInput
              label="Password"
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              mode="outlined"
              secureTextEntry
              error={!!(errors.password && touched.password)}
              style={styles.input}
            />
            <Button
              mode="contained"
              onPress={() => handleSubmit()}
              disabled={isSubmitting}
              style={styles.button}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                "Login"
              )}
            </Button>
            <Text style={styles.registerText}>
              Don't have an account?{" "}
              <Text style={styles.registerLink}>Register</Text>
            </Text>
          </>
        )}
      </Formik>
      {showPlane && <PlaneAnimation />}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 10,
    marginHorizontal: 20,
    elevation: 5,
  },
  logo: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#FBBC05",
  },
  registerText: {
    textAlign: "center",
    marginTop: 10,
  },
  registerLink: {
    color: "#6200ee",
    fontWeight: "bold",
  },
});

export default LoginCard;
