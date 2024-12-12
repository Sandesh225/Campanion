import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import { clearAuthState, setTokens } from "../store/slices/authSlice";
import { getTokens, storeTokens, clearTokens } from "../utils/keychain";
import { showErrorToast } from "../utils/toast";
import axios, { AxiosRequestConfig } from "axios";

interface RefreshTokenResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

const API_BASE_URL = "http://192.168.100.150:3000/api"; // Ensure this matches your backend

export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const { dispatch } = api;
  const state = api.getState() as RootState;
  const { accessToken } = state.auth;

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

          // Retry the original query with new access token
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
        // No refresh token, clear auth state
        dispatch(clearAuthState());
        await clearTokens();
        showErrorToast("Unauthorized", "Please log in.");
        return { error: { status: 401, data: "Unauthorized" } };
      }
    }

    // Handle other errors
    return { error: { status: error.response?.status, data: error.message } };
  }
};
