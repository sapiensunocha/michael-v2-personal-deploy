// src/redux/slices/mapSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Placeholder types for ArcGIS objects to allow compilation
interface EsriMapInstance {
  map: any; // You'll want to replace 'any' with actual ArcGIS Map type if needed
  view: any; // You'll want to replace 'any' with actual ArcGIS MapView type if needed
}

interface MapState {
  mapInstance: EsriMapInstance | null;
}

const initialState: MapState = {
  mapInstance: null,
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setMapInstance: (state, action: PayloadAction<EsriMapInstance | null>) => {
      state.mapInstance = action.payload;
    },
  },
});

export const { setMapInstance } = mapSlice.actions;
export default mapSlice.reducer;