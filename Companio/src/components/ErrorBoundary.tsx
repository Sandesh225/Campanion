// src/components/common/ErrorBoundary.tsx

import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { showErrorToast } from "../utils/toast";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    // Update state to display fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    showErrorToast("An unexpected error occurred.", error.message);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    // Optionally, reload the app or navigate to a safe screen
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong.</Text>
          <Button title="Try Again" onPress={this.handleRetry} />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    color: "#ff0000",
  },
});

export default ErrorBoundary;
