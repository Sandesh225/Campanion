// src/services/api.ts

import {
  createApi,
  fetchBaseQuery,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import {
  User,
  ApiResponse,
  AuthData,
  LikePayload,
  UpdateProfilePayload,
} from "../types/api";
import { showErrorToast, showSuccessToast } from "../utils/toast";
import { setCredentials, clearCredentials, setUser } from "../slices/authSlice";

// Define baseQuery with token refresh logic
const baseQuery = fetchBaseQuery({
  baseUrl: "http://192.168.100.150:3000/api",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Create a custom baseQuery to handle 401 errors
const baseQueryWithReauth: typeof baseQuery = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Attempt to refresh token
    const refreshToken = (api.getState() as RootState).auth.refreshToken;
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          user,
        } = (refreshResult.data as ApiResponse<AuthData>).data;

        // Update tokens in Redux store
        api.dispatch(
          setCredentials({
            user,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          })
        );

        // Retry the original query with new access token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh token failed, clear credentials
        api.dispatch(clearCredentials());
        showErrorToast("Session Expired", "Please log in again.");
      }
    } else {
      // No refresh token, clear credentials
      api.dispatch(clearCredentials());
      showErrorToast("Session Expired", "Please log in again.");
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Auth Endpoints
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
            dispatch(
              setCredentials({
                user: data.data.user,
                accessToken: data.data.accessToken,
                refreshToken: data.data.refreshToken,
              })
            );
            showSuccessToast("Login Successful", "Welcome back!");
          }
        } catch (error: any) {
          showErrorToast(
            "Login Failed",
            error?.data?.message || "Please try again."
          );
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
            dispatch(
              setCredentials({
                user: data.data.user,
                accessToken: data.data.accessToken,
                refreshToken: data.data.refreshToken,
              })
            );
            showSuccessToast("Registration Successful", "Welcome aboard!");
          }
        } catch (error: any) {
          showErrorToast(
            "Registration Failed",
            error?.data?.message || "Please try again."
          );
        }
      },
    }),
    logout: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearCredentials());
          console.log("Credentials cleared");
          showSuccessToast(
            "Logged Out",
            "You have been logged out successfully."
          );
        } catch (error: any) {
          showErrorToast(
            "Logout Failed",
            error?.data?.message || "Please try again."
          );
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
            dispatch(setUser(data.data));
          }
        } catch (error: any) {
          showErrorToast(
            "Fetch Profile Failed",
            error?.data?.message || "Please try again."
          );
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
            dispatch(
              setCredentials({
                user: data.data.user,
                accessToken: data.data.accessToken,
                refreshToken: data.data.refreshToken,
              })
            );
            showSuccessToast(
              "Token Refreshed",
              "Your session has been extended."
            );
          }
        } catch (error: any) {
          showErrorToast(
            "Token Refresh Failed",
            (error as any)?.data?.message || "Please log in again."
          );
          dispatch(clearCredentials());
        }
      },
    }),

    // User Endpoints
    getUserProfile: builder.query<ApiResponse<User>, string>({
      query: (userId) => `/users/${userId}`,
      providesTags: (result, error, userId) => [{ type: "User", id: userId }],
    }),
    updateUserProfile: builder.mutation<
      ApiResponse<User>,
      UpdateProfilePayload
    >({
      query: ({ userId, ...patch }) => ({
        url: `/users/${userId}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "User", id: userId },
      ],
    }),
    uploadProfilePicture: builder.mutation<
      ApiResponse<{ profilePictureUrl: string }>,
      { userId: string; file: any }
    >({
      query: ({ userId, file }) => {
        const formData = new FormData();
        formData.append("profilePicture", file);

        return {
          url: `/users/${userId}/profile/picture`,
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            showSuccessToast(
              "Profile Picture Updated",
              "Your profile picture has been updated."
            );
          }
        } catch (error: any) {
          showErrorToast(
            "Upload Failed",
            error?.data?.message || "Please try again."
          );
        }
      },
    }),
    uploadTravelPhoto: builder.mutation<
      ApiResponse<{ travelPhotos: string[] }>,
      { userId: string; file: any }
    >({
      query: ({ userId, file }) => {
        const formData = new FormData();
        formData.append("travelPhoto", file);

        return {
          url: `/users/${userId}/travel-photos`,
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            showSuccessToast(
              "Travel Photo Uploaded",
              "Your travel photo has been uploaded."
            );
          }
        } catch (error: any) {
          showErrorToast(
            "Upload Failed",
            error?.data?.message || "Please try again."
          );
        }
      },
    }),
    deleteTravelPhoto: builder.mutation<
      ApiResponse<{ travelPhotos: string[] }>,
      { userId: string; photoUrl: string }
    >({
      query: ({ userId, photoUrl }) => ({
        url: `/users/${userId}/travel-photos`,
        method: "DELETE",
        body: { photoUrl },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            showSuccessToast(
              "Travel Photo Deleted",
              "Your travel photo has been deleted."
            );
          }
        } catch (error: any) {
          showErrorToast(
            "Deletion Failed",
            error?.data?.message || "Please try again."
          );
        }
      },
    }),
    likeUser: builder.mutation<ApiResponse<{ matched: boolean }>, LikePayload>({
      query: (payload) => ({
        url: "/users/like",
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            if (data.data.matched) {
              showSuccessToast("It's a Match!", "You have a new match!");
            } else {
              showSuccessToast("Liked", "User liked successfully.");
            }
          }
        } catch (error: any) {
          showErrorToast(
            "Like Failed",
            error?.data?.message || "Please try again."
          );
        }
      },
    }),
    getMatches: builder.query<ApiResponse<User[]>, string>({
      query: (userId) => `/users/matchmaking?userId=${userId}`,
      providesTags: (result, error, userId) => [{ type: "User", id: userId }],
    }),
    getBadges: builder.query<ApiResponse<any[]>, string>({
      query: (userId) => `/users/badges?userId=${userId}`,
    }),
    searchUsers: builder.query<ApiResponse<User[]>, any>({
      query: (params) => {
        const queryParams = new URLSearchParams(params).toString();
        return `/users?${queryParams}`;
      },
    }),
    completeProfile: builder.mutation<
      ApiResponse<User>,
      { userId: string; profile: any }
    >({
      query: ({ userId, profile }) => ({
        url: `/users/${userId}/complete-profile`,
        method: "POST",
        body: { profile },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "User", id: userId },
      ],
    }),
    deleteAccount: builder.mutation<ApiResponse<null>, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearCredentials());
          showSuccessToast("Account Deleted", "Your account has been deleted.");
        } catch (error: any) {
          showErrorToast(
            "Deletion Failed",
            error?.data?.message || "Please try again."
          );
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetMeQuery,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUploadProfilePictureMutation,
  useUploadTravelPhotoMutation,
  useDeleteTravelPhotoMutation,
  useLikeUserMutation,
  useGetMatchesQuery,
  useGetBadgesQuery,
  useSearchUsersQuery,
  useCompleteProfileMutation,
  useDeleteAccountMutation,
} = api;
