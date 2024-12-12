// src/components/common/FormikTextInput.tsx
import React from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { useField } from "formik";

interface FormikTextInputProps {
  name: string;
  label: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: string;
  leftIcon?: string;
  accessibilityLabel?: string;
}

const FormikTextInput: React.FC<FormikTextInputProps> = ({
  name,
  label,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = "default",
  leftIcon,
  accessibilityLabel,
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <TextInput
      label={label}
      value={field.value}
      onChangeText={helpers.setValue}
      onBlur={() => helpers.setTouched(true)}
      secureTextEntry={secureTextEntry}
      multiline={multiline}
      numberOfLines={numberOfLines}
      keyboardType={keyboardType}
      mode="outlined"
      error={meta.touched && Boolean(meta.error)}
      left={leftIcon ? <TextInput.Icon name={leftIcon} /> : undefined}
      style={styles.input}
      accessibilityLabel={accessibilityLabel}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 16,
  },
});

export default React.memo(FormikTextInput);
