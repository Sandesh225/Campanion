// src/components/Common/Button.tsx

import React from 'react';
import {Button as PaperButton, ButtonProps} from 'react-native-paper';

interface CustomButtonProps extends ButtonProps {
  label: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({label, ...props}) => {
  return (
    <PaperButton
      mode="contained"
      {...props}
      labelStyle={{fontSize: 16}}
      contentStyle={{paddingVertical: 8}}
      style={{marginVertical: 8}}>
      {label}
    </PaperButton>
  );
};

export default React.memo(CustomButton);
