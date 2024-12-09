import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthData, ApiResponse, User } from "../types/api";
import * as Keychain from "react-native-keychain";
import { RootState } from "../store";
import axiosInstance from "./axiosInstance";
import { setUser, clearAuth } from "../slices/authSlice"; // Import authSlice actions

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.100.150:3000/api",
    prepareHeaders: async (headers, { getState }) => {
      const credentials = await Keychain.getGenericPassword({
        service: "accessToken",
      });
      const accessToken = credentials ? credentials.password : null;
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<
      ApiResponse<AuthData>,
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            // Store tokens
            await Keychain.setGenericPassword(
              "accessToken",
              data.data.accessToken,
              {
                service: "accessToken",
              }
            );
            await Keychain.setGenericPassword(
              "refreshToken",
              data.data.refreshToken,
              {
                service: "refreshToken",
              }
            );
            // Update user state in Redux
            dispatch(setUser(data.data.user));
          }
        } catch (error) {
          console.error("Login error:", error);
          // Optionally, handle login errors here
        }
      },
    }),
    register: builder.mutation<
      ApiResponse<AuthData>,
      { username: string; email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            // Store tokens
            await Keychain.setGenericPassword(
              "accessToken",
              data.data.accessToken,
              {
                service: "accessToken",
              }
            );
            await Keychain.setGenericPassword(
              "refreshToken",
              data.data.refreshToken,
              {
                service: "refreshToken",
              }
            );
            // Update user state in Redux
            dispatch(setUser(data.data.user));
          }
        } catch (error) {
          console.error("Registration error:", error);
          // Optionally, handle registration errors here
        }
      },
    }),
    logout: builder.mutation<ApiResponse<null>, { refreshToken: string }>({
      query: (body) => ({
        url: "/auth/logout",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Clear tokens
          await Keychain.resetGenericPassword({ service: "accessToken" });
          await Keychain.resetGenericPassword({ service: "refreshToken" });
          // Clear user state in Redux
          dispatch(clearAuth());
        } catch (error) {
          console.error("Logout error:", error);
          // Optionally, handle logout errors here
        }
      },
    }),
    refreshToken: builder.mutation<
      ApiResponse<AuthData>,
      { refreshToken: string }
    >({
      query: (body) => ({
        url: "/auth/refresh-token",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            // Update tokens
            await Keychain.setGenericPassword(
              "accessToken",
              data.data.accessToken,
              {
                service: "accessToken",
              }
            );
            await Keychain.setGenericPassword(
              "refreshToken",
              data.data.refreshToken,
              {
                service: "refreshToken",
              }
            );
            // Update user state in Redux
            dispatch(setUser(data.data.user));
          }
        } catch (error) {
          console.error("Refresh token error:", error);
          // Optionally, handle refresh token errors here
        }
      },
    }),
    getMe: builder.query<ApiResponse<User>, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            // Update user state in Redux
            dispatch(setUser(data.data));
          }
        } catch (error) {
          console.error("GetMe error:", error);
          // Optionally, handle getMe errors here
        }
      },
    }),
    // Add more endpoints as needed
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetMeQuery,
} = authApi;
