// src/components/common/Input.tsx

import React from "react";
import { TextInput } from "react-native-paper";
import { View, Text, StyleSheet } from "react-native";

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  style?: any;
  error?: boolean;
  helperText?: string;
  leftIcon?: string;
  accessibilityLabel?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  style,
  error,
  helperText,
  leftIcon,
  accessibilityLabel,
}) => {
  return (
    <View style={[styles.container, style]}>
      {leftIcon && <Text style={styles.icon}>{leftIcon}</Text>}
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        style={styles.input}
        accessibilityLabel={accessibilityLabel}
      />
      {helperText && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  icon: {
    marginRight: 8,
    fontSize: 20,
  },
  input: {
    backgroundColor: "white",
  },
  helperText: {
    color: "red",
    fontSize: 12,
  },
});

export default Input;
