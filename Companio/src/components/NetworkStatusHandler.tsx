// src/components/NetworkStatusHandler.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { showErrorToast } from "../utils/toast";

const NetworkStatusHandler: React.FC = () => {
  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        showErrorToast(
          "Network Error",
          "Please check your internet connection."
        );
      }
    });

    return () => unsubscribe();
  }, []);

  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default NetworkStatusHandler;
