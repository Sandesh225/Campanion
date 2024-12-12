// src/api/apiSlice.ts
import {
  createApi,
  FetchArgs,
  FetchBaseQueryError,
  BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import { RootState, AppDispatch } from "../store/store"; // Correct import
import { setTokens, clearAuthState } from "../store/slices/authSlice";
import { getTokens, storeTokens, clearTokens } from "../utils/keychain";
import { showErrorToast } from "../utils/toast";
import axios, { AxiosRequestConfig } from "axios";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  LogoutRequest,
  User,
  Activity,
} from "../types/auth";

// Define API base URL
const API_BASE_URL = "http://192.168.100.150:3000/api"; // Update as needed

// Define Refresh Token Response
interface RefreshTokenResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

// Base Query with Token Refresh Logic
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const { dispatch } = api;
  const state = api.getState() as RootState;
  const accessToken = state.auth.accessToken;

  const axiosConfig: AxiosRequestConfig = {
    baseURL: API_BASE_URL,
    url: typeof args === "string" ? args : args.url,
    method: typeof args === "string" ? "GET" : args.method,
    data: typeof args !== "string" ? args.body : undefined,
    params: typeof args !== "string" ? args.params : undefined,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  };

  try {
    const result = await axios(axiosConfig);
    return { data: result.data };
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Attempt to refresh token
      const tokens = await getTokens();
      if (tokens?.refreshToken) {
        try {
          const refreshResponse = await axios.post<RefreshTokenResponse>(
            `${API_BASE_URL}/auth/refresh-token`,
            { refreshToken: tokens.refreshToken }
          );

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            refreshResponse.data.data;

          // Store new tokens
          await storeTokens(newAccessToken, newRefreshToken);

          // Update Redux store
          dispatch(
            setTokens({
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            })
          );

          // Retry original request with new access token
          const retryAxiosConfig: AxiosRequestConfig = {
            ...axiosConfig,
            headers: {
              ...axiosConfig.headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
          };

          const retryResult = await axios(retryAxiosConfig);
          return { data: retryResult.data };
        } catch (refreshError: any) {
          // Refresh token failed
          dispatch(clearAuthState());
          await clearTokens();
          showErrorToast("Session Expired", "Please log in again.");
          return { error: { status: 401, data: "Unauthorized" } };
        }
      } else {
        // No refresh token available
        dispatch(clearAuthState());
        await clearTokens();
        showErrorToast("Unauthorized", "Please log in.");
        return { error: { status: 401, data: "Unauthorized" } };
      }
    }

    // Handle other errors
    return {
      error: {
        status: error.response?.status || 500,
        data: error.message || "Unknown Error",
      },
    };
  }
};

// Create API Slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Trip", "Activity"],
  endpoints: (builder) => ({
    // Register Endpoint
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    // Login Endpoint
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    // Get Current User
    getMe: builder.query<User, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
      transformResponse: (response: { data: User }) => response.data, // Adjust based on server response
    }),
    // Logout Endpoint
    logout: builder.mutation<{ data: null }, LogoutRequest>({
      query: (body) => ({
        url: "/auth/logout",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    // Get Nearby Activities
    getNearbyActivities: builder.query<Activity[], string>({
      query: (userId) => ({
        url: "/activities/nearby",
        method: "GET",
        params: { userId },
      }),
      providesTags: ["Activity"],
    }),
    // Add more endpoints as needed
  }),
});

// Export hooks for usage in functional components
export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useLogoutMutation,
  useGetNearbyActivitiesQuery,
} = apiSlice;
