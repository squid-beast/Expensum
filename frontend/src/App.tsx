import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import DashboardPage from "@/pages/DashboardPage";
import ExpensesPage from "@/pages/ExpensesPage";
import IncomeSetupPage from "@/pages/IncomeSetupPage";
import HouseholdPage from "@/pages/HouseholdPage";
import NotFoundPage from "@/pages/NotFoundPage";

function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage />}
        />
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <ExpensesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/income-setup"
          element={
            <ProtectedRoute>
              <IncomeSetupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/household"
          element={
            <ProtectedRoute>
              <HouseholdPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
