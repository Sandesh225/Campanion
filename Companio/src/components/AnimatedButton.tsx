// src/components/AnimatedButton.tsx

import React from "react";
import { StyleSheet, TouchableWithoutFeedback, GestureResponderEvent } from "react-native";
import { Button, useTheme } from "react-native-paper";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated';

interface AnimatedButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  title: string;
  mode: "contained" | "outlined" | "text";
  icon?: string;
  style?: object;
  accessibilityLabel: string;
  accessibilityHint: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  onPress,
  title,
  mode,
  icon,
  style,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const scale = useSharedValue(1);
  const theme = useTheme();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      <Animated.View style={[animatedStyle, style]}>
        <Button mode={mode} icon={icon} contentStyle={styles.content} labelStyle={styles.label}>
          {title}
        </Button>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
  },
  label: {
    fontWeight: "bold",
  },
});

export default AnimatedButton;
