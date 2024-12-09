import React from "react";
import { Appbar } from "react-native-paper";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types";

interface HeaderProps {
  title: string;
  navigation?: NavigationProp<RootStackParamList>;
  back?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, navigation, back }) => {
  const nav = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <Appbar.Header>
      {back && <Appbar.BackAction onPress={() => nav.goBack()} />}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};

export default React.memo(Header);
