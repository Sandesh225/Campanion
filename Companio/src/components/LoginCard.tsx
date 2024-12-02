import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { AuthContext } from "../context/AuthContext";
import PlaneAnimation from "./PlaneAnimation";
import { Formik } from "formik";
import * as Yup from "yup";

const LoginCard: React.FC = () => {
  const { login } = useContext(AuthContext);
  const [showPlane, setShowPlane] = useState<boolean>(false);

  // Validation schema using Yup
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      await login(values.email, values.password);
      setShowPlane(true);
      // Hide plane after animation completes (e.g., 3 seconds)
      setTimeout(() => {
        setShowPlane(false);
      }, 3000);
    } catch (error) {
      // Error handled in AuthContext
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
              style={styles.input}
              placeholder="Email or Username"
              placeholderTextColor="#3C4043"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="username"
            />
            {errors.email && touched.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#3C4043"
              secureTextEntry
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              textContentType="password"
            />
            {errors.password && touched.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}
              activeOpacity={0.8}
              disabled={isSubmitting}
            >
              <Animatable.View
                animation="fadeIn"
                duration={500}
                style={styles.buttonContent}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#3C4043" />
                ) : (
                  <Text style={styles.buttonText}>✈️ Login</Text>
                )}
              </Animatable.View>
            </TouchableOpacity>
          </>
        )}
      </Formik>
      {showPlane && <PlaneAnimation />}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    top: "25%",
    alignSelf: "center",
    width: "85%",
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4285F4",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#3C4043",
    borderRadius: 8,
    padding: 12,
    marginVertical: 5,
    fontSize: 16,
    color: "#000000",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 12,
    marginBottom: 5,
    marginLeft: 5,
  },
  button: {
    backgroundColor: "#FBBC05",
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#3C4043",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoginCard;
