import React from "react";
import { View } from "react-native";
import { Text, Button } from "react-native-paper";
import { useGetMeQuery, useLogoutMutation } from "../api/authApi";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthState } from "../features/authSlice";
import { clearTokens } from "../utils/keychain";
import { RootState } from "../store/store";

export const HomeScreen = () => {
  const { data, isLoading, error } = useGetMeQuery();
  const [logoutFn] = useLogoutMutation();
  const { refreshToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    if (refreshToken) {
      await logoutFn({ refreshToken });
    }
    await clearTokens();
    dispatch(clearAuthState());
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading profile</Text>;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text variant="headlineLarge" style={{ marginBottom: 20 }}>
        Welcome, {data?.data?.username}
      </Text>
      <Button mode="contained" onPress={handleLogout}>
        Logout
      </Button>
    </View>
  );
};
