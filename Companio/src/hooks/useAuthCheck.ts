// src/hooks/useAuthCheck.ts
import { useEffect, useState } from "react";
import useAppDispatch from "./useAppDispatch";
import { setTokens, setUser, clearAuthState } from "../store/slices/authSlice";
import { getTokens } from "../utils/keychain";
import { useLazyGetMeQuery } from "../api/apiSlice"; // Correct import from apiSlice.ts
import { showErrorToast, showSuccessToast } from "../utils/toast";

export const useAuthCheck = () => {
  const dispatch = useAppDispatch();
  const [authInitialized, setAuthInitialized] = useState(false);
  const [triggerGetMe, { data, error }] = useLazyGetMeQuery();

  useEffect(() => {
    const initializeAuthAndTheme = async () => {
      try {
        const tokens = await getTokens();
        if (tokens && tokens.accessToken && tokens.refreshToken) {
          dispatch(setTokens(tokens));
          triggerGetMe(); // Trigger the getMe query
        } else {
          dispatch(clearAuthState());
        }

        // Load theme preference if applicable
        // const savedTheme = await getThemePref();
        // if (typeof savedTheme === 'boolean') {
        //   dispatch(setTheme(savedTheme));
        // }
      } catch (error) {
        console.error("Error during auth/theme initialization:", error);
        showErrorToast("Initialization Error", "Failed to initialize app.");
      } finally {
        setAuthInitialized(true);
      }
    };

    initializeAuthAndTheme();
  }, [dispatch, triggerGetMe]);

  useEffect(() => {
    if (!authInitialized) return;

    if (data) {
      dispatch(setUser(data));
      showSuccessToast("Welcome", `Hello, ${data.username}!`);
    }

    if (error) {
      const status = (error as any)?.status || (error as any)?.error?.status;
      if (status === 401) {
        dispatch(clearAuthState());
        showErrorToast(
          "Authentication Error",
          "Session expired. Please log in again."
        );
      } else {
        showErrorToast("Error", "Failed to load user profile.");
      }
    }
  }, [data, error, dispatch, authInitialized]);

  return { authInitialized };
};
