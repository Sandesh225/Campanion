// src/types/react-native-toast-message.d.ts

declare module "react-native-toast-message" {
  import React from "react";
  import { ViewProps } from "react-native";

  export interface ToastConfig {
    [key: string]: (props: any) => JSX.Element;
  }

  export interface ToastProps extends ViewProps {
    type: string;
    text1?: string;
    text2?: string;
    position?: "top" | "bottom";
    visibilityTime?: number;
    autoHide?: boolean;
    onShow?: () => void;
    onHide?: () => void;
    onPress?: () => void;
    props?: any;
  }

  export const BaseToast: React.FC<any>;
  export const ErrorToast: React.FC<any>;

  export interface ToastOptions {
    type: string;
    text1?: string;
    text2?: string;
    position?: "top" | "bottom";
    visibilityTime?: number;
    autoHide?: boolean;
    onShow?: () => void;
    onHide?: () => void;
    onPress?: () => void;
    props?: any;
  }

  class ToastComponent extends React.Component {
    static show(options: ToastOptions): void;
    static hide(): void;
  }

  export default ToastComponent;
}
