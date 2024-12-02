// src/components/Common/TextInputField.tsx

import React from 'react';
import {TextInput, HelperText} from 'react-native-paper';
import {useField} from 'formik';

interface TextInputFieldProps {
  name: string;
  label: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  placeholder?: string;
}

const TextInputField: React.FC<TextInputFieldProps> = ({
  name,
  label,
  secureTextEntry = false,
  keyboardType = 'default',
  placeholder = '',
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <>
      <TextInput
        label={label}
        mode="outlined"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholder={placeholder}
        value={field.value}
        onChangeText={helpers.setValue}
        onBlur={helpers.setTouched}
        error={meta.touched && !!meta.error}
        style={{marginBottom: 10}}
      />
      {meta.touched && meta.error && (
        <HelperText type="error" visible={true}>
          {meta.error}
        </HelperText>
      )}
    </>
  );
};

export default React.memo(TextInputField);
