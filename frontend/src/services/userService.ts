import api from "./api";
import type { UserProfile } from "@/types/auth.types";

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    const res = await api.get<UserProfile>("/users/profile");
    return res.data;
  },

  updateIncome: async (data: {
    monthlyIncome: number;
    savingsGoal?: number;
  }): Promise<UserProfile> => {
    const res = await api.put<UserProfile>("/users/income", data);
    return res.data;
  },
};
