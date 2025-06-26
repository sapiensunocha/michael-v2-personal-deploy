import { createSlice } from "@reduxjs/toolkit";
// Theme Slice
const themeInitialState = {
  theme: "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState: themeInitialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
