import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const EONET_API_URL = process.env.REACT_APP_NASA_API_URL;
const EONET_CATEGORIES_API_URL = process.env.REACT_APP_EONET_CATEGORIES_API_URL;

export const fetchDisasters = createAsyncThunk(
  "disasters/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { limit = 300, start, end } = params;

      const queryParams = {
        limit,
        status: "open",
      };

      if (start) queryParams.start = start;
      if (end) queryParams.end = end;

      const response = await toast.promise(
        axios.get(EONET_API_URL, { params: queryParams }),
        {
          pending: "Fetching disaster data...",
          success: "Disaster data loaded successfully!",
          error: "Failed to load disaster data",
        },
      );

      // Filter for events where closed is null
      const activeEvents = response.data.events.filter(
        (event) => event.closed === null,
      );

      return activeEvents;
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchDisastersByCategory = createAsyncThunk(
  "disasters/fetchByCategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await toast.promise(
        axios.get(`${EONET_CATEGORIES_API_URL}/${id}`),
        {
          pending: "Fetching filtered disaster data...",
          success: "Filtered data loaded successfully!",
          error: "Failed to load filtered data",
        },
      );
      return response.data.events;
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const disasterService = {
  fetchDisasters,
  fetchDisastersByCategory,
};
