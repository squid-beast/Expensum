import { create } from "zustand";

interface SettingsState {
  currency: string;
  setCurrency: (currency: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  currency: localStorage.getItem("currency") || "USD",
  setCurrency: (currency) => {
    localStorage.setItem("currency", currency);
    set({ currency });
  },
}));
