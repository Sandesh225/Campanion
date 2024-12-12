// src/store/selectors/authSelectors.ts
import { RootState } from "../../store/store";

export const selectAuth = (state: RootState) => state.auth;
export const selectAuthUser = (state: RootState) => state.auth.user;
