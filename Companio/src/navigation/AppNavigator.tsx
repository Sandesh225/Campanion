// src/navigation/AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import useAppSelector from "../hooks/useAppSelector";
import { selectAuth } from "../store/selectors/authSelectors"; // Correct import

const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useAppSelector(selectAuth);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
