// src/components/Common/Header.tsx

import React from 'react';
import {Appbar} from 'react-native-paper';

interface HeaderProps {
  title: string;
  navigation?: any;
  back?: boolean;
}

const Header: React.FC<HeaderProps> = ({title, navigation, back}) => {
  return (
    <Appbar.Header>
      {back && <Appbar.BackAction onPress={() => navigation.goBack()} />}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};

export default React.memo(Header);
