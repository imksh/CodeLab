import { create } from "zustand";

const useUiStore = create((set) => ({
  theme: "dark",
  currentProblemNumber: null,
  setCurrentProblemNumber: (num) => set({ currentProblemNumber: num }),
  maximizeView: false,
  toggleMaximizeView: () => {
    set((state) => ({ maximizeView: !state.maximizeView }));
  },
  toggleTheme: () => {
    set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" }));
  },
  setTheme: (theme) => {
    set({ theme });
  },
}));

export default useUiStore;
