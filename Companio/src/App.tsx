// src/App.tsx

import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";
import { Provider as PaperProvider } from "react-native-paper";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Toast from "react-native-toast-message";
import { StyleSheet } from "react-native";
import toastConfig from "./utils/toastConfig";
import AppNavigator from "./navigation";
import NetworkStatusHandler from "./components/NetworkStatusHandler";
import InitializeApp from "./components/InitializeApp";
import theme from "./theme/index";

const App: React.FC = () => {
  return (
    <ReduxProvider store={store}>
      <ErrorBoundary>
        <PaperProvider theme={theme}>
          <NetworkStatusHandler />
          <InitializeApp />
          <AppNavigator />
          <Toast config={toastConfig} />
        </PaperProvider>
      </ErrorBoundary>
    </ReduxProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
