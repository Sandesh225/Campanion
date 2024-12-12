import React from "react";
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

  return null;
};

export default NetworkStatusHandler;
