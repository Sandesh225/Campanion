import React from "react";
import { Appbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/navigation";

interface CustomAppBarProps {
  title: string;
  showProfileButton?: boolean;
}

const CustomAppBar: React.FC<CustomAppBarProps> = ({
  title,
  showProfileButton = false,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <Appbar.Header>
      <Appbar.Content title={title} />
      {showProfileButton && (
        <Appbar.Action
          icon="account"
          onPress={() => navigation.navigate("Profile")}
        />
      )}
    </Appbar.Header>
  );
};

export default CustomAppBar;
