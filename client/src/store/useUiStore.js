import { create } from "zustand";

const useUiStore = create((set) => ({
  theme: localStorage.getItem("codelab.imksh.theme") || "dark",
  currentProblemNumber: null,
  setCurrentProblemNumber: (num) => set({ currentProblemNumber: num }),
  maximizeView: false,
  toggleMaximizeView: () => {
    set((state) => ({ maximizeView: !state.maximizeView }));
  },
  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("codelab.imksh.theme", nextTheme);
      return { theme: nextTheme };
    });
  },
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem("codelab.imksh.theme", theme)
  },
  
}));

export default useUiStore;
