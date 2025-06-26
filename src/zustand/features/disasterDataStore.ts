import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface DisasterData {
  id: string;
  title: string;
  location: {
    lat: number;
    lng: number;
  };
  severity: string;
  type: string;
  affectedArea: string;
  date: string;
  description: string;
}

interface DisasterStore {
  disasters: {
    volcanoes: DisasterData[];
    wildfires: DisasterData[];
    droughts: DisasterData[];
    earthquakes: DisasterData[];
    floods: DisasterData[];
    conflicts: DisasterData[];
    developments: DisasterData[];
    technologicals: DisasterData[];
    severeStorms: DisasterData[];
  };
  setDisasterData: (category: string, data: DisasterData[]) => void;
  clearDisasterData: (category: string) => void;
}

const useDisasterStore = create<DisasterStore>()(
  devtools(
    immer((set) => ({
      disasters: {
        volcanoes: [],
        wildfires: [],
        droughts: [],
        earthquakes: [],
        floods: [],
        conflicts: [],
        developments: [],
        technologicals: [],
        severeStorms: [],
      },
      setDisasterData: (category, data) =>
        set((state) => {
          state.disasters[category as keyof typeof state.disasters] = data;
        }),
      clearDisasterData: (category) =>
        set((state) => {
          state.disasters[category as keyof typeof state.disasters] = [];
        }),
    })),
    { name: "disaster-store" },
  ),
);

export default useDisasterStore;
