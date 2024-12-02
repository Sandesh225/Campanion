// src/config/index.ts

import {
  MD3LightTheme as DefaultTheme,
  configureFonts,
} from "react-native-paper";

const fontConfig = {
  default: {
    regular: {
      fontFamily: "Roboto-Regular",
      fontWeight: "400",
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.5,
    },
    medium: {
      fontFamily: "Roboto-Medium",
      fontWeight: "500",
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.5,
    },
    light: {
      fontFamily: "Roboto-Light",
      fontWeight: "300",
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.5,
    },
    thin: {
      fontFamily: "Roboto-Thin",
      fontWeight: "100",
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.5,
    },
  },
};

const theme = {
  ...DefaultTheme,
  roundness: 8,
  colors: {
    ...DefaultTheme.colors,
    primary: "#6200ee",
    secondary: "#03dac4",
    background: "#f5f5f5",
    surface: "#ffffff",
    error: "#B00020",
    text: "#000000",
    onSurface: "#000000",
    disabled: "#f0f0f0",
    placeholder: "#a0a0a0",
    backdrop: "#00000099",
  },
  fonts: configureFonts(fontConfig), // Corrected usage
};

export const Config = {
  API_URL: "http://192.168.100.150:3000/api", // Replace with your actual API URL
  SOCKET_URL: "http://192.168.100.150:3000", // Replace with your actual Socket.IO server URL
};

export default theme;
