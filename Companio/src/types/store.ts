// src/types/store.ts
import { apiSlice } from "../api/apiSlice";
import { User } from "./auth";

export interface RootState {
  auth: {
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
  };
  theme: {
    darkMode: boolean;
  };
  [apiSlice.reducerPath]: ReturnType<typeof apiSlice.reducer>;
}

export type AppDispatch = typeof store.dispatch; // Will be defined in store.ts
