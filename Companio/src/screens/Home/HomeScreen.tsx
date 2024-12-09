import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { useAppSelector } from "../../store/hooks";
import { selectAuthUser } from "../../slices/authSlice";
import { useGetUserProfileQuery, useLogoutMutation } from "../../services/api";
import { useNavigation } from "@react-navigation/native"; // <-- Import here
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/navigation";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;
const HomeScreen: React.FC = () => {
  const user = useAppSelector(selectAuthUser);
  const { data, error, isLoading } = useGetUserProfileQuery(user?.id || "", {
    skip: !user?.id,
  });
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  // Use the useNavigation hook here
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (error) {
      // Handled by onQueryStarted in api
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error fetching profile. Please try again later.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome, {data?.data?.username || "Traveler"}!
      </Text>
      {/* Just a demonstration button */}
      <Button
        mode="contained"
        onPress={handleLogout}
        loading={isLoggingOut}
        disabled={isLoggingOut}
        style={styles.button}
      >
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#6200ee",
    textAlign: "center",
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
    width: "60%",
  },
});

export default HomeScreen;
