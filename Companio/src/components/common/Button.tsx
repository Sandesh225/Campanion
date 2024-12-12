// src/components/common/Button.tsx

import React, { FC, memo } from "react";
import { Button as PaperButton, useTheme } from "react-native-paper";
import { StyleProp, ViewStyle } from "react-native";

interface ButtonProps {
  onPress: () => void;
  text: string;
  mode?: "text" | "outlined" | "contained";
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  icon?: string;
}

const Button: FC<ButtonProps> = ({
  onPress,
  text,
  mode = "contained",
  disabled = false,
  loading = false,
  accessibilityLabel,
  style,
  icon,
}) => {
  const theme = useTheme();

  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      accessibilityLabel={accessibilityLabel || text}
      accessibilityRole="button"
      style={[{ borderRadius: 24, paddingVertical: 8 }, style]}
      icon={icon}
    >
      {text}
    </PaperButton>
  );
};

export default memo(Button);
