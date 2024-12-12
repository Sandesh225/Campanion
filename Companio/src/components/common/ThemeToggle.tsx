// src/components/common/ThemeToggle.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Switch, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { toggleTheme } from "../../store/slices/themeSlice";

const ThemeToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const { t } = useTranslation();

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <View style={styles.container}>
      <Text>{t("dark_mode")}</Text>
      <Switch value={isDarkMode} onValueChange={handleToggle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
});

export default React.memo(ThemeToggle);
