export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
}

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  monthlyIncome: number;
  savingsGoal: number | null;
  phoneNumber: string | null;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}
