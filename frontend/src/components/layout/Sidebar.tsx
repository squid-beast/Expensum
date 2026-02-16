import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Receipt, Wallet, Home, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import HouseholdSwitcher from "@/components/household/HouseholdSwitcher";

const links: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/expenses", label: "Expenses", icon: Receipt },
  { to: "/income-setup", label: "Income", icon: Wallet },
  { to: "/household", label: "Household", icon: Home },
];

export default function Sidebar() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary">Budget Buddy</h1>
        <p className="text-xs text-muted-foreground mt-1">Smart personal finance</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )
            }
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <HouseholdSwitcher />

      <div className="p-3 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
