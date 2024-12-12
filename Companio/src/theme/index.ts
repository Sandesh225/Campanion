// src/theme/index.ts
import {
  MD3DarkTheme,
  MD3LightTheme,
  configureFonts,
  MD3Theme,
} from "react-native-paper";

// Correct font configuration structure
const fontConfig = {
  default: {
    regular: {
      fontFamily: "Roboto-Regular",
      fontWeight: "normal",
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.25,
    },
    medium: {
      fontFamily: "Roboto-Medium",
      fontWeight: "500",
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.15,
    },
    light: {
      fontFamily: "Roboto-Light",
      fontWeight: "300",
      fontSize: 12,
      lineHeight: 18,
      letterSpacing: 0.4,
    },
    thin: {
      fontFamily: "Roboto-Thin",
      fontWeight: "100",
      fontSize: 10,
      lineHeight: 14,
      letterSpacing: 0.5,
    },
  },
};

export const getTheme = (isDarkMode: boolean): MD3Theme => {
  const baseTheme = isDarkMode ? MD3DarkTheme : MD3LightTheme;

  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: "#0083FF",
      secondary: "#6DD5FA", // Use secondary instead of accent
      background: isDarkMode ? "#121212" : "#F5F5F5",
      surface: isDarkMode ? "#1E1E1E" : "#FFFFFF",
      onSurface: isDarkMode ? "#FFFFFF" : "#333333", // Replace text with onSurface
      outline: "#999999", // Use outline for placeholder-like colors
      backdrop: "rgba(0,0,0,0.5)",
    },
    fonts: configureFonts(fontConfig), // Corrected font configuration
  };
};

// Optional: Define custom typography styles outside the theme object
export const customTypography = {
  headlineLarge: {
    fontFamily: "Roboto-Regular",
    fontWeight: "normal",
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0.15,
  },
  // Add other custom typography variants here
};
