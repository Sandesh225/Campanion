// src/components/common/ErrorBoundary.tsx
import React, { Component, ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { showErrorToast } from "../../utils/toast";

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
    // Update state so the next render shows the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // You can log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    showErrorToast("Unexpected Error", "Something went wrong.");
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <View style={styles.container}>
          <Text style={styles.text}>Something went wrong.</Text>
          <Button mode="contained" onPress={this.handleRetry}>
            Retry
          </Button>
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
  },
  text: {
    marginBottom: 16,
    fontSize: 18,
    color: "#333",
  },
});

export default ErrorBoundary;
