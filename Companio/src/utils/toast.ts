// src/utils/toast.ts

import Toast from "react-native-toast-message";

export const showSuccessToast = (message: string, description?: string) => {
  Toast.show({
    type: "success",
    text1: message,
    text2: description,
  });
};

export const showErrorToast = (message: string, description?: string) => {
  Toast.show({
    type: "error",
    text1: message,
    text2: description,
  });
};

export const showInfoToast = (message: string, description?: string) => {
  Toast.show({
    type: "info",
    text1: message,
    text2: description,
  });
};
