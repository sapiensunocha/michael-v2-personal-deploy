import { create } from "zustand";

type UserEmailStore = {
  userEmail: string | null;
  setUserEmail: (userEmail: string) => void;
};

const useUserEmailStore = create<UserEmailStore>((set) => ({
  userEmail: null,
  setUserEmail: (email) => set(() => ({ userEmail: email })),
}));

export default useUserEmailStore;
