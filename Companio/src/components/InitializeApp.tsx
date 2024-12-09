// src/components/InitializeApp.tsx

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectAccessToken,
  selectRefreshToken,
  setCredentials,
  clearCredentials,
} from "../slices/authSlice";
import { useRefreshTokenMutation } from "../services/api";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import * as Keychain from "react-native-keychain";
import { showErrorToast } from "../utils/toast";

const InitializeApp: React.FC = () => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectAccessToken);
  const refreshToken = useAppSelector(selectRefreshToken);

  // Automatically attempt to refresh token on startup
  const [refreshTokenMutation, { isLoading }] = useRefreshTokenMutation();

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessTokenCredentials = await Keychain.getGenericPassword({
          service: "accessToken",
        });
        const refreshTokenCredentials = await Keychain.getGenericPassword({
          service: "refreshToken",
        });

        // If tokens are found in the Keychain, dispatch them to the store
        if (accessTokenCredentials && refreshTokenCredentials) {
          dispatch(
            setCredentials({
              user: null, // User will be fetched by getMe
              accessToken: accessTokenCredentials.password,
              refreshToken: refreshTokenCredentials.password,
            })
          );
        }
      } catch (error) {
        console.error("Initialization Error:", error);
        showErrorToast("Initialization Failed", "Please try again.");
      }
    };

    // Initialize tokens from Keychain and refetch user data if tokens exist
    initialize();
  }, [dispatch]);

  useEffect(() => {
    // If tokens are available, try refreshing the session
    if (accessToken && refreshToken) {
      refreshTokenMutation({ refreshToken })
        .unwrap()
        .catch((error) => {
          dispatch(clearCredentials());
          showErrorToast("Session Expired", "Please log in again.");
        });
    }
  }, [accessToken, refreshToken, dispatch, refreshTokenMutation]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6DD5FA" />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
});

export default InitializeApp;
