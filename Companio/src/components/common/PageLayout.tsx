import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import CustomAppBar from "./CustomAppBar";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, children }) => {
  return (
    <SafeAreaView style={styles.container}>
      <CustomAppBar title={title} showProfileButton />
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default PageLayout;
