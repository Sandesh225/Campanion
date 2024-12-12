import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import { setUser } from "../store/slices/authSlice";

export interface User {
  id: string;
  username: string;
  email: string;
  profilePictureUrl?: string;
  bio?: string;
}

interface AuthResponse {
  data: {
    id: string;
    username: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    user?: User;
  };
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  tagTypes: ["User", "Trip", "Activity"],
  endpoints: (builder) => ({
    register: builder.mutation<
      AuthResponse,
      { username: string; email: string; password: string }
    >({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    getMe: builder.query<User, void>({
      query: () => "/auth/me",
      transformResponse: (response: AuthResponse) => response.data.user as User,
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(setUser(data));
          }
        } catch {}
      },
      providesTags: ["User"],
    }),
    logout: builder.mutation<{ data: null }, { refreshToken: string }>({
      query: (body) => ({
        url: "/auth/logout",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    searchUsers: builder.query<{ data: User[] }, { excludeUserId?: string }>({
      query: ({ excludeUserId }) => ({
        url: "/users/search",
        method: "GET",
        params: { excludeUserId },
      }),
      providesTags: ["User"],
    }),
    likeUser: builder.mutation<
      { data: null },
      { userId: string; likedUserId: string }
    >({
      query: (body) => ({
        url: "/users/like",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    createTrip: builder.mutation<
      { data: null },
      {
        title: string;
        description: string;
        origin: string;
        destination: string;
        startDate: string;
        endDate: string;
        travelMode: string;
        budget: {
          amount: number;
          currency: string;
        };
      }
    >({
      query: (body) => ({
        url: "/trips",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Trip"],
    }),
    getNearbyActivities: builder.query<{ data: Activity[] }, string>({
      query: (userId) => ({
        url: "/activities/nearby",
        method: "GET",
        params: { userId },
      }),
      providesTags: ["Activity"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useLogoutMutation,
  useSearchUsersQuery,
  useLikeUserMutation,
  useCreateTripMutation,
  useGetNearbyActivitiesQuery,
} = authApi;
