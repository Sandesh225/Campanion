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

const RegisterCard: React.FC = () => {
  const { register } = useContext(AuthContext);
  const [showPlane, setShowPlane] = useState<boolean>(false);

  // Validation schema using Yup
  const RegisterSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])/,
        "Password must include one uppercase, one lowercase, one digit, and one special character."
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleRegister = async (values: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      await register(values.username, values.email, values.password);
      setShowPlane(true);
      // Hide plane after animation completes (e.g., 3 seconds)
      setTimeout(() => {
        setShowPlane(false);
      }, 3000);
      Alert.alert(
        "Registration Successful",
        "You have been registered successfully."
      );
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
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={RegisterSchema}
        onSubmit={handleRegister}
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
              placeholder="Username"
              placeholderTextColor="#3C4043"
              onChangeText={handleChange("username")}
              onBlur={handleBlur("username")}
              value={values.username}
              autoCapitalize="none"
              textContentType="username"
            />
            {errors.username && touched.username ? (
              <Text style={styles.errorText}>{errors.username}</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#3C4043"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
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
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#3C4043"
              secureTextEntry
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              value={values.confirmPassword}
              textContentType="password"
            />
            {errors.confirmPassword && touched.confirmPassword ? (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
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
                  <Text style={styles.buttonText}>📝 Register</Text>
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
    top: "20%",
    alignSelf: "center",
    width: "90%",
    backgroundColor: "rgba(255,255,255,0.9)",
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

export default RegisterCard;
