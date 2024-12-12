// src/App.tsx
import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";
import { store } from "./store/store";
import AppNavigator from "./navigation/AppNavigator";
import Toast from "react-native-toast-message";
import toastConfig from "./utils/toastConfig";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Loading from "./components/Loading";
import { useAuthCheck } from "./hooks/useAuthCheck";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

const ThemedApp: React.FC = () => {
  const { authInitialized } = useAuthCheck();

  if (!authInitialized) {
    return <Loading />;
  }

  return <AppNavigator />;
};

const App: React.FC = () => {
  return (
    <ReduxProvider store={store}>
      <SafeAreaProvider>
        <I18nextProvider i18n={i18n}>
          <PaperProvider>
            <ErrorBoundary>
              <ThemedApp />
            </ErrorBoundary>
            <Toast config={toastConfig} />
          </PaperProvider>
        </I18nextProvider>
      </SafeAreaProvider>
    </ReduxProvider>
  );
};

export default App;
