import { create } from "zustand";
import axios from "axios";

const EONET_API_URL: string = process.env.EONET_API_URL || "";
const EONET_EVENT_API_URL: string =
  "https://dev-wdc.com/api/v1/event/list?withPagination=true&page=1&limit=300";
// const EONET_CATEGORIES_API_URL: string =
//   process.env.REACT_APP_EONET_CATEGORIES_API_URL || "";

interface Disaster {
  id: string;
  location: { lat: number; lng: number };
  title: string;
  type: string;
  severity: string;
  affectedArea: string;
  date: string;
  closed: string | null;
}

interface FetchParams {
  limit?: number;
  start?: string;
  end?: string;
}

interface DisasterStore {
  filteredDisasters: Disaster[];
  loading: boolean;
  error: string | null;
  fetchDisasters: (params?: FetchParams) => Promise<void>;
  fetchDisastersByCategory: (id: string) => Promise<void>;
}

const useDisasterStore = create<DisasterStore>((set) => ({
  filteredDisasters: [],
  loading: false,
  error: null,

  fetchDisasters: async (params: FetchParams = {}) => {
    set({ loading: true, error: null }); // Start loading and reset error

    try {
      const { limit = 300, start, end } = params;

      const queryParams: Record<string, string | number> = {
        limit,
        status: "open",
      };

      if (start) queryParams.start = start;
      if (end) queryParams.end = end;

      if (!EONET_API_URL) throw new Error("EONET_API_URL is not defined");

      const response = await axios.get<{ events: Disaster[] }>(
        EONET_EVENT_API_URL,
        {
          params: queryParams,
        },
      );

      const activeEvents = response.data.events.filter(
        (event) => event.closed === null,
      );
      set({ filteredDisasters: activeEvents, loading: false }); // Update state
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      set({ loading: false, error: errorMessage });
    }
  },

  fetchDisastersByCategory: async () => {
    set({ loading: true, error: null });

    try {
      // Your existing code for fetching disasters by category
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      set({ loading: false, error: errorMessage });
    }
  },
}));

export default useDisasterStore;
