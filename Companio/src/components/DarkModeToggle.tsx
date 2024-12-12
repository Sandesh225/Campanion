import React, { FC, memo } from "react";
import { View, StyleSheet } from "react-native";
import { Switch, Text, useTheme } from "react-native-paper";

import { toggleTheme } from "../features/themeSlice";
import useAppDispatch from "../hooks/useAppDispatch";
import useAppSelector from "../hooks/useAppSelector";

const DarkModeToggle: FC = () => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const { colors } = useTheme();

  const onToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.onSurface }]}>Dark Mode</Text>
      <Switch
        value={isDarkMode}
        onValueChange={onToggle}
        accessibilityLabel="Toggle Dark Mode"
        accessibilityHint="Switch between dark and light themes"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
  },
});

export default memo(DarkModeToggle);
