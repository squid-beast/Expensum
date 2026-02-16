import { create } from "zustand";
import type { UserProfile } from "@/types/auth.types";

function loadUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: UserProfile) => void;
  setUser: (user: UserProfile) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: loadUser(),
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  setAuth: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  clearAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("activeHousehold");
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
