import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type SelectedCategoryStore = {
  selectedCategory: string;
  setSelectedCategory: (
    category: SelectedCategoryStore["selectedCategory"],
  ) => void;
};

const useSelectCategoryStore = create<SelectedCategoryStore>()(
  devtools(
    immer((set) => ({
      selectedCategory: "",
      setSelectedCategory: (category) =>
        set((state) => {
          state.selectedCategory = category;
        }),
    })),
    { name: "selected-category-store" },
  ),
);

export default useSelectCategoryStore;
