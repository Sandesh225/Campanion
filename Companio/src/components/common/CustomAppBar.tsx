// src/components/common/CustomAppBar.tsx

import React from "react";
import { Appbar } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";

interface CustomAppBarProps {
  title: string;
  canGoBack?: boolean;
  showProfileButton?: boolean;
}

const CustomAppBar: React.FC<CustomAppBarProps> = ({
  title,
  canGoBack = false,
  showProfileButton = false,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <Appbar.Header style={styles.appBar}>
      {canGoBack && <Appbar.BackAction onPress={() => navigation.goBack()} />}
      <Appbar.Content title={title} />
      {showProfileButton && (
        <Appbar.Action
          icon="account-circle"
          onPress={() => navigation.navigate("Profile")}
        />
      )}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: "#6200ee",
  },
});

export default CustomAppBar;
