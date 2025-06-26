import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type UserLocationStore = {
  locationAlert: {
    lng: number;
    lat: number;
  };
  setLocationAlert: (lat: number, lng: number) => void;
};

const useUserLocationStore = create<UserLocationStore>()(
  devtools(
    immer((set) => ({
      locationAlert: {
        lat: 0,
        lng: 0,
      },
      setLocationAlert: (lat, lng) =>
        set((state) => {
          state.locationAlert.lat = lat;
          state.locationAlert.lng = lng;
        }),
    })),
    { name: "user-location-store" },
  ),
);

export default useUserLocationStore;
