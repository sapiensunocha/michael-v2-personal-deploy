// src/redux/slice/location/index.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
  selectedLocation: { lat: number; lon: number; address: string } | null;
}

const initialState: LocationState = {
  selectedLocation: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setSelectedLocation: (state, action: PayloadAction<{ lat: number; lon: number; address: string } | null>) => {
      state.selectedLocation = action.payload;
    },
  },
});

export const { setSelectedLocation } = locationSlice.actions;
export default locationSlice.reducer;