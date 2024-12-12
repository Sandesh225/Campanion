// src/components/LanguageSelector.tsx

import React, { FC, memo } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { I18nManager } from "react-native";
import RNRestart from "react-native-restart"; // Install react-native-restart

const LanguageSelector: FC = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "ar" : "en";
    i18n.changeLanguage(newLanguage).then(() => {
      const isRTL = newLanguage === "ar";
      I18nManager.forceRTL(isRTL);
      RNRestart.Restart(); // Restart the app to apply RTL changes
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {currentLanguage === "en" ? "English" : "العربية"}
      </Text>
      <Button
        mode="outlined"
        onPress={toggleLanguage}
        accessibilityLabel="Change Language"
      >
        {currentLanguage === "en" ? "Switch to Arabic" : "Switch to English"}
      </Button>
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

export default memo(LanguageSelector);
