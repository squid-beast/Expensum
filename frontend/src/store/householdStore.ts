import { create } from "zustand";
import type { Household } from "@/types/household.types";

function loadActiveHousehold(): Household | null {
  try {
    const raw = localStorage.getItem("activeHousehold");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

interface HouseholdState {
  households: Household[];
  activeHousehold: Household | null;
  setHouseholds: (households: Household[]) => void;
  setActiveHousehold: (household: Household | null) => void;
  clearHousehold: () => void;
}

export const useHouseholdStore = create<HouseholdState>((set) => ({
  households: [],
  activeHousehold: loadActiveHousehold(),

  setHouseholds: (households) => set({ households }),

  setActiveHousehold: (household) => {
    if (household) {
      localStorage.setItem("activeHousehold", JSON.stringify(household));
    } else {
      localStorage.removeItem("activeHousehold");
    }
    set({ activeHousehold: household });
  },

  clearHousehold: () => {
    localStorage.removeItem("activeHousehold");
    set({ households: [], activeHousehold: null });
  },
}));
