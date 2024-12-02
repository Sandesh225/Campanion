// src/components/common/FormikTextInput.tsx

import React from "react";
import { TextInput as PaperTextInput } from "react-native-paper";
import { useFormikContext, useField } from "formik";
import { StyleSheet } from "react-native";

interface FormikTextInputProps {
  name: string;
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: string;
}

const FormikTextInput: React.FC<FormikTextInputProps> = ({
  name,
  ...props
}) => {
  const { setFieldValue } = useFormikContext<any>();
  const [field, meta] = useField(name);

  return (
    <PaperTextInput
      {...props}
      value={field.value}
      onChangeText={(value) => setFieldValue(name, value)}
      error={meta.touched && meta.error ? true : false}
      style={styles.input}
      mode="outlined"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
  },
});

export default FormikTextInput;
