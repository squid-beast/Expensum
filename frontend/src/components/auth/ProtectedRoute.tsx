import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const { pathname } = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Force income setup as the first step after login
  const needsIncome = !user || user.monthlyIncome <= 0;
  if (needsIncome && pathname !== "/income-setup") {
    return <Navigate to="/income-setup" replace />;
  }

  return <>{children}</>;
}
