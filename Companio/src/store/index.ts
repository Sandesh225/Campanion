// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { api } from "../services/api";
import authReducer from "../slices/authSlice";
import loggerMiddleware from "../middlewares/loggerMiddleware";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware).concat(loggerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
