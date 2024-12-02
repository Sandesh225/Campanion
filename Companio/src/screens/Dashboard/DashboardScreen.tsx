// src/screens/Dashboard/DashboardScreen.tsx

import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button, Surface } from "react-native-paper";
import { useAuth } from "../../hooks/useAuth"; // Custom hook to access AuthContext
import MatchList from "../../components/MatchList";
import Badges from "../../components/Badges";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";
import CustomAppBar from "../../components/common/CustomAppBar";
import MatchNotification from "../../components/MatchNotification";
import { useMatch } from "../../context/MatchContext";

type NavigationProps = NavigationProp<RootStackParamList, "Dashboard">;

const DashboardScreen: React.FC = () => {
  const { userId, logout } = useAuth();
  const navigation = useNavigation<NavigationProps>();
  const { newMatch, clearNewMatch } = useMatch();

  const handleLogout = async () => {
    await logout();
    navigation.navigate("Login");
  };

  const handleStartChat = (profileId: string) => {
    navigation.navigate("Chat", { otherUserId: profileId });
    clearNewMatch();
  };

  return (
    <View style={styles.container}>
      <CustomAppBar title="Dashboard" canGoBack={false} />
      <Text variant="headlineLarge" style={styles.title}>
        Your Matches
      </Text>
      <MatchList userId={userId} />
      <Text variant="headlineLarge" style={styles.title}>
        Your Badges
      </Text>
      <Badges />
      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        contentStyle={styles.buttonContent}
        accessibilityLabel="Logout"
        accessibilityHint="Logs you out of your account"
      >
        Logout
      </Button>
      {newMatch && (
        <MatchNotification match={newMatch} onStartChat={handleStartChat} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    color: "#6200ee",
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
  buttonContent: {
    paddingVertical: 10,
  },
});

export default DashboardScreen;
