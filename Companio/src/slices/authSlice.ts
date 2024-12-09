// src/slices/authSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/api";
import { RootState } from "../store";
import * as Keychain from "react-native-keychain";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        user: User | null;
        accessToken: string;
        refreshToken: string;
      }>
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = !!action.payload.accessToken;

      // Store tokens securely
      Keychain.setGenericPassword("accessToken", action.payload.accessToken, {
        service: "accessToken",
      });
      Keychain.setGenericPassword("refreshToken", action.payload.refreshToken, {
        service: "refreshToken",
      });
    },
    clearCredentials(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      // Clear tokens from secure storage
      Keychain.resetGenericPassword({ service: "accessToken" });
      Keychain.resetGenericPassword({ service: "refreshToken" });
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      // Update access token in Keychain
      Keychain.setGenericPassword("accessToken", action.payload, {
        service: "accessToken",
      });
    },
    setRefreshToken(state, action: PayloadAction<string>) {
      state.refreshToken = action.payload;
      // Update refresh token in Keychain
      Keychain.setGenericPassword("refreshToken", action.payload, {
        service: "refreshToken",
      });
    },
  },
});

export const {
  setCredentials,
  clearCredentials,
  setUser,
  setAccessToken,
  setRefreshToken,
} = authSlice.actions;

// Selectors
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;

export default authSlice.reducer;
