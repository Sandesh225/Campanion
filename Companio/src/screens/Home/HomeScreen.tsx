// src/screens/Home/HomeScreen.tsx
import React, { useEffect, useCallback } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { useGetMeQuery, useLogoutMutation } from "../../api/apiSlice"; // Correct import
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { clearAuthState, setUser } from "../../store/slices/authSlice";
import { clearTokens } from "../../utils/keychain";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Loading from "../../components/Loading";
import HeaderSection from "./HeaderSection";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../../types/navigation";

type HomeScreenNavigationProp = StackNavigationProp<MainStackParamList, "Home">;

const HomeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { data, isLoading, error } = useGetMeQuery();
  const [logoutFn, { isLoading: isLoggingOut }] = useLogoutMutation();
  const { refreshToken, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      const status = (error as any)?.status || (error as any)?.error?.status;

      if (status === 401) {
        dispatch(clearAuthState());
        clearTokens();
        showErrorToast(
          "Authentication Error",
          "Session expired. Please log in again."
        );
        navigation.replace("Login");
      } else {
        showErrorToast("Error", "Failed to load user profile.");
      }
    }

    if (data) {
      dispatch(setUser(data));
      showSuccessToast("Welcome", `Hello, ${data.username}!`);
    }
  }, [data, error, dispatch, navigation]);

  const handleLogout = useCallback(async () => {
    try {
      if (refreshToken) {
        await logoutFn({ refreshToken }).unwrap();
        showSuccessToast(
          "Logged Out",
          "You have been logged out successfully."
        );
      }
    } catch (logoutError: any) {
      showErrorToast("Logout Failed", "Unable to logout. Please try again.");
    } finally {
      await clearTokens();
      dispatch(clearAuthState());
      navigation.replace("Login");
    }
  }, [logoutFn, refreshToken, dispatch, navigation]);

  if (isLoading) return <Loading />;

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading user data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <HeaderSection />
      {/* Add your other sections/components here */}
      <View style={styles.logoutButtonContainer}>
        <Button
          mode="contained"
          onPress={handleLogout}
          loading={isLoggingOut}
          style={styles.logoutButton}
          accessibilityLabel="Logout Button"
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  logoutButtonContainer: {
    margin: 16,
  },
  logoutButton: {
    borderRadius: 30,
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
