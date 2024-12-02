// src/utils/helpers.ts

import Toast from "react-native-toast-message";

/**
 * Show a toast message.
 * @param type Type of the toast ('success', 'error', 'info')
 * @param title Title of the toast
 * @param message Message body of the toast
 */
export const showToast = (
  type: "success" | "error" | "info",
  title: string,
  message: string
) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
    position: "bottom",
  });
};
