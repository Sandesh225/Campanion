// src/utils/toastConfig.ts

import { BaseToast, ErrorToast, ToastConfig } from "react-native-toast-message";

interface CustomToastProps {
  text1: string;
  text2?: string;
  onPress?: () => void;
  [key: string]: any;
}

const toastConfig: ToastConfig = {
  success: (props: CustomToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "green" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
      }}
    />
  ),
  error: (props: CustomToastProps) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "red" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),
  // Optionally, add other toast types like info
};

export default toastConfig;
