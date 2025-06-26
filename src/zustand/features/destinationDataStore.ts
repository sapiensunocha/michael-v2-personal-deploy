import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type DestinationLocationStore = {
  destinationLocation: {
    lng: number;
    lat: number;
  };
  setDestinationLocation: (lat: number, lng: number) => void;
};

const useDestinationLocationStore = create<DestinationLocationStore>()(
  devtools(
    immer((set) => ({ 
      destinationLocation: {
        lat: 0,
        lng: 0,
      },
      setDestinationLocation: (lat, lng) =>
        set((state) => {
          state.destinationLocation.lat = lat;
          state.destinationLocation.lng = lng;
        }),
    })),
    { name: "destination-location-store" },
  ),
);

export default useDestinationLocationStore;
