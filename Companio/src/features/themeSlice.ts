import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { storeThemePref } from "../../utils/keychain";

interface ThemeState {
  isDarkMode: boolean;
}

const initialState: ThemeState = {
  isDarkMode: false,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.isDarkMode = !state.isDarkMode;
      storeThemePref(state.isDarkMode);
    },
    setTheme(state, action: PayloadAction<boolean>) {
      state.isDarkMode = action.payload;
      storeThemePref(action.payload);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
