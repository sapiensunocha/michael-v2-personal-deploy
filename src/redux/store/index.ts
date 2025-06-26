// src/redux/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import apiPredictionSlice from "../slice/prediction";
import themeSlice from "../slice/theme";
import disasterSlice from "../slice/disasters";
import locationSlice from "../slice/location"; // Keep if you use location

const store = configureStore({
  reducer: {
    prediction: apiPredictionSlice,
    theme: themeSlice,
    disasters: disasterSlice,
    location: locationSlice, // Keep if you use location
    // REMOVE THIS LINE: map: mapSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;