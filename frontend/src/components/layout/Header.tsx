import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useHouseholdStore } from "@/store/householdStore";
import NotificationBell from "@/components/common/NotificationBell";
import AchievementBadge from "@/components/common/AchievementBadge";
import MemberPresence from "@/components/dashboard/MemberPresence";

export default function Header() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const activeHousehold = useHouseholdStore((s) => s.activeHousehold);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {activeHousehold && <MemberPresence householdId={activeHousehold.id} />}
      </div>
      <div className="flex items-center gap-3">
        <AchievementBadge />
        <NotificationBell />

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent transition-colors cursor-pointer"
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
              {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <span className="text-sm font-medium hidden sm:inline">{user?.fullName ?? "User"}</span>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-border bg-card shadow-lg py-1 z-50"
              >
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-medium truncate">{user?.fullName ?? "User"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email ?? ""}</p>
                </div>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors cursor-pointer"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  View Profile
                </button>

                <div className="border-t border-border my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
