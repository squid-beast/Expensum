import api from "./api";
import type { AuthResponse, LoginRequest, SignupRequest } from "@/types/auth.types";

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/login", data);
    return res.data;
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/signup", data);
    return res.data;
  },
};
