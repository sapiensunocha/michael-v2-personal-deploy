import { create } from "zustand";

interface DirectionClickedState {
  isDirectionClicked: boolean;
  setIsDirectionClicked: (clicked: boolean) => void;
}

const useDirectionClickedStore = create<DirectionClickedState>(
  (set: (arg0: { isDirectionClicked: boolean }) => any) => ({
    isDirectionClicked: false,
    setIsDirectionClicked: (clicked: boolean) =>
      set({ isDirectionClicked: clicked }),
  }),
);

export default useDirectionClickedStore;
