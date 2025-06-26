import axios from "axios";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// Define the types for the state and actions
interface AlertState {
  alertData: any | null;
  error: string | null;
  sendAlert: (body: Record<string, any>) => Promise<void>;
}

// Create the store using Zustand
const useAlertStore = create<AlertState>()(
  devtools(
    immer((set) => ({
      alertData: null,
      error: null,
      sendAlert: async (body: Record<string, any>) => {
        try {
          const { data } = await axios.post(
            `${process.env.REACT_APP_ALERT_API_KEY}/`,
            body,
          );
          set((state) => {
            state.alertData = data;
            state.error = null;
          });
        } catch (error: any) {
          const { response } = error;
          const errorData =
            response?.data || error.message || "An error occurred";
          set((state) => {
            state.error = errorData;
            state.alertData = null;
          });
        }
      },
    })),
    { name: "alert-store" },
  ),
);

export default useAlertStore;
