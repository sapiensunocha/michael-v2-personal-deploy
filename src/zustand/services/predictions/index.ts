import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = process.env.REACT_APP_PREDICTION_API_URL;
const API_ALERT = process.env.REACT_APP_ALERT_API_KEY;

interface PredictionState {
  data: any | null;
  loading: boolean;
  error: string | null;
  receiverEmail: string | null;
  cities: string[];
  alert: any | null;
  selectedLocation: string | null;
  selectSearchType: string | null;
  setSelectedLocation: (location: string | null) => void;
  setSelectSearchType: (type: string | null) => void;
  fetchPredictionApiData: (
    location: { lat: number; long: number },
    type: string,
  ) => Promise<void>;
  sendWeatherAlertRequest: (
    receiverEmail: string,
    cities: string[],
  ) => Promise<void>;
}

const usePredictionStore = create<PredictionState>((set) => ({
  data: null,
  loading: false,
  error: null,
  receiverEmail: null,
  cities: [],
  alert: null,
  selectedLocation: null,
  selectSearchType: null,

  setSelectedLocation: (location) => set({ selectedLocation: location }),
  setSelectSearchType: (type) => set({ selectSearchType: type }),

  fetchPredictionApiData: async (location, type) => {
    set({ loading: true, error: null });
    try {
      const response = await toast.promise(
        axios.get(`${apiUrl}`, {
          params: { lat: location.lat, long: location.long, searchType: type },
        }),
        {
          pending: "Fetching data...",
          error: {
            render({ data }: any) {
              return `Error: ${data.message}`;
            },
          },
        },
      );

      const data = response.data;
      toast.success("Data fetched successfully!");
      set({ data: data?.body, loading: false });
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
      set({ error: error.response?.data || error.message, loading: false });
    }
  },

  sendWeatherAlertRequest: async (receiverEmail, cities) => {
    set({ loading: true, error: null });
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
            render({ data }: any) {
              return `Error: ${data.message}`;
            },
          },
        },
      );

      const data = response.data;
      toast.success("Request sent successfully!");
      set({ alert: data, loading: false });
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
      set({ error: error.response?.data || error.message, loading: false });
    }
  },
}));

export default usePredictionStore;
