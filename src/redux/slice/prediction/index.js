import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPredictionApiData,
  sendWeatherAlertRequest,
} from "../../services/prediction";

const initialState = {
  data: null,
  loading: false,
  error: null,
  receiverEmail: null,
  cities: [],
  alert: null,
  selectedLocation: null,
  selectSearchType: null,
};

const apiPredictionSlice = createSlice({
  name: "prediction",
  initialState,
  reducers: {
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    setSelectSearchType: (state, action) => {
      state.selectSearchType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPredictionApiData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPredictionApiData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPredictionApiData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(sendWeatherAlertRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendWeatherAlertRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.alert = action.payload;
      })
      .addCase(sendWeatherAlertRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { setSelectedLocation, setSelectSearchType } =
  apiPredictionSlice.actions;
export default apiPredictionSlice.reducer;
