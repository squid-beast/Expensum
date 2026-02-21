import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Home,
  UserCog,
  Settings,
  LogOut,
  User,
  ChevronsUpDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useHouseholdStore } from "@/store/householdStore";
import { Avatar, AvatarFallback } from "@/ui/avatar";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

/* ------------------------------------------------------------------ */
/*  Nav config                                                         */
/* ------------------------------------------------------------------ */

const iconClass = "h-4 w-4 shrink-0";

const navSections = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className={iconClass} /> },
      { label: "Expenses", href: "/expenses", icon: <Receipt className={iconClass} /> },
    ],
  },
  {
    label: "Manage",
    items: [
      { label: "Income", href: "/income-setup", icon: <Wallet className={iconClass} /> },
      { label: "Household", href: "/household", icon: <Home className={iconClass} /> },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Profile", href: "/profile", icon: <UserCog className={iconClass} /> },
      { label: "Settings", href: "/settings", icon: <Settings className={iconClass} /> },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Household Switcher (sidebar header)                                */
/* ------------------------------------------------------------------ */

function SidebarHouseholdSwitcher() {
  const { households, activeHousehold, setActiveHousehold } = useHouseholdStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel = activeHousehold ? activeHousehold.name : "Personal";
  const currentSubtitle = activeHousehold ? "Household" : "Individual";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 w-full rounded-lg px-2 py-2 hover:bg-accent transition-colors cursor-pointer text-left"
      >
        {/* Logo icon */}
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <span
            className="text-sm font-bold text-primary"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            E
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{currentLabel}</p>
          <p className="text-[11px] text-muted-foreground truncate">{currentSubtitle}</p>
        </div>
        <ChevronsUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 right-0 top-full mt-1 z-50 rounded-xl border border-border bg-card shadow-lg py-1"
          >
            <button
              onClick={() => { setActiveHousehold(null); setOpen(false); }}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2 text-sm transition-colors cursor-pointer",
                !activeHousehold ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <User className="h-4 w-4" />
              <span>Personal</span>
            </button>
            {households.map((h) => (
              <button
                key={h.id}
                onClick={() => { setActiveHousehold(h); setOpen(false); }}
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2 text-sm transition-colors cursor-pointer truncate",
                  activeHousehold?.id === h.id ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                <Home className="h-4 w-4 shrink-0" />
                <span className="truncate">{h.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  User Card (sidebar footer)                                         */
/* ------------------------------------------------------------------ */

function SidebarUserCard() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { setOpen: setSidebarOpen } = useSidebar();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initial = user?.fullName?.charAt(0)?.toUpperCase() ?? "U";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 w-full rounded-lg px-2 py-2 hover:bg-accent transition-colors cursor-pointer text-left"
      >
        <Avatar>
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {initial}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{user?.fullName ?? "User"}</p>
          <p className="text-[11px] text-muted-foreground truncate">{user?.email ?? ""}</p>
        </div>
        <ChevronsUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 right-0 bottom-full mb-1 z-50 rounded-xl border border-border bg-card shadow-lg py-1"
          >
            <div className="px-3 py-2 border-b border-border">
              <p className="text-sm font-medium truncate">{user?.fullName ?? "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email ?? ""}</p>
            </div>
            <button
              onClick={() => {
                setOpen(false);
                setSidebarOpen(false);
                navigate("/profile");
              }}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors cursor-pointer"
            >
              <User className="h-4 w-4" />
              View Profile
            </button>
            <div className="h-px bg-border mx-1" />
            <button
              onClick={() => {
                setOpen(false);
                clearAuth();
                navigate("/login");
              }}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      {/* Header: Logo + Household Switcher */}
      <SidebarHeader>
        <SidebarHouseholdSwitcher />
      </SidebarHeader>

      <SidebarSeparator />

      {/* Navigation */}
      <SidebarContent>
        {navSections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    href={item.href}
                    isActive={location.pathname === item.href}
                  >
                    {item.icon}
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer: User Card */}
      <SidebarFooter>
        <SidebarUserCard />
      </SidebarFooter>
    </Sidebar>
  );
}
