import { NavLink } from "react-router-dom";
import { LayoutDashboard, Receipt, Wallet, Home } from "lucide-react";
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
  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      <div className="p-6">
        <h1 className="flex items-center text-xl">
          <span className="tracking-tight text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>Expen</span>
          <span className="tracking-tight text-primary" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 300 }}>Sum</span>
        </h1>
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
    </aside>
  );
}
