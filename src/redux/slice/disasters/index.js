import { createSlice } from "@reduxjs/toolkit";
import {
  fetchDisasters,
  fetchDisastersByCategory,
} from "../../services/disasters";

const initialState = {
  disasters: [],
  filteredDisasters: [],
  selectedCategory: null,
  loading: false,
  error: null,
};

const disasterSlice = createSlice({
  name: "disasters",
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDisasters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDisasters.fulfilled, (state, action) => {
        state.loading = false;
        state.disasters = action.payload;
        state.filteredDisasters = action.payload;
      })
      .addCase(fetchDisasters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDisastersByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDisastersByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredDisasters = action.payload;
      })
      .addCase(fetchDisastersByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedCategory } = disasterSlice.actions;
export default disasterSlice.reducer;
