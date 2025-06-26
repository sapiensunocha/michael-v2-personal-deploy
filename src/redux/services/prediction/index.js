import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = process.env.REACT_APP_PREDICTION_API_URL;
const API_ALERT = process.env.REACT_APP_ALERT_API_KEY;

export const fetchPredictionApiData = createAsyncThunk(
  "api/fetchData",
  async ({ location, type }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await toast.promise(
        axios.get(`${apiUrl}`, {
          params: { lat: location.lat, long: location.long, searchType: type },
        }),

        {
          pending: "Fetching data...",
          error: {
            render({ data }) {
              return `Error: ${data.message}`;
            },
          },
        },
      );

      const data = response.data;
      toast.success("Data fetched successfully!");
      console.log(data);
      return data?.body;
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.log(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const sendWeatherAlertRequest = createAsyncThunk(
  "api/sendWeatherAlert",
  async ({ receiverEmail, cities }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await toast.promise(
        axios.post(
          `${API_ALERT}/send-alert`,
          {
            receiver_email: receiverEmail,
            cities,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "Content-Type",
              "Access-Control-Max-Age": "3600",
            },
          },
        ),
        {
          pending: "Sending request...",
          error: {
            render({ data }) {
              return `Error: ${data.message}`;
            },
          },
        },
      );

      const data = response.data;
      toast.success("Request sent successfully!");
      return data;
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const campanyService = {
  fetchPredictionApiData,
};
