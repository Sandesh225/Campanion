// src/theme/index.ts

import { DefaultTheme } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#0083FF",
    accent: "#6DD5FA",
    background: "#F5F5F5",
    surface: "#FFFFFF",
    text: "#333333",
    placeholder: "#999999",
    backdrop: "rgba(0,0,0,0.5)",
  },
  fonts: {
    regular: {
      fontFamily: "Roboto-Regular",
      fontWeight: "normal",
    },
    medium: {
      fontFamily: "Roboto-Medium",
      fontWeight: "500",
    },
    light: {
      fontFamily: "Roboto-Light",
      fontWeight: "300",
    },
    thin: {
      fontFamily: "Roboto-Thin",
      fontWeight: "100",
    },
    bodySmall: {
      fontFamily: "Roboto-Regular",
      fontWeight: "normal",
      fontSize: 12,
      lineHeight: 16,
    },
    labelLarge: {
      fontFamily: "Roboto-Medium",
      fontWeight: "500",
      fontSize: 14,
      lineHeight: 20,
    },
    bodyLarge: {
      fontFamily: "Roboto-Regular",
      fontWeight: "400",
      fontSize: 16,
      lineHeight: 24,
    },
    titleMedium: {
      fontFamily: "Roboto-Medium",
      fontWeight: "500",
      fontSize: 20,
      lineHeight: 28,
    },
    // Add the headlineMedium variant
    headlineMedium: {
      fontFamily: "Roboto-Medium",
      fontWeight: "500",
      fontSize: 24, // A larger font size for headlines
      lineHeight: 32, // Adjust line height for proper spacing
    },
  },
};

export default theme;
