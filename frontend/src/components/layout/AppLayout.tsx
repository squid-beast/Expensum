import { useEffect, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuthStore } from "@/store/authStore";
import { userService } from "@/services/userService";
import { useHouseholdStore } from "@/store/householdStore";
import { householdService } from "@/services/householdService";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, setUser, isAuthenticated } = useAuthStore();
  const { setHouseholds, activeHousehold, setActiveHousehold } =
    useHouseholdStore();

  useEffect(() => {
    if (isAuthenticated && !user) {
      userService.getProfile().then(setUser).catch(console.error);
    }
  }, [isAuthenticated, user, setUser]);

  // Hydrate household store on mount
  useEffect(() => {
    if (!isAuthenticated) return;
    householdService
      .getMyHouseholds()
      .then((list) => {
        setHouseholds(list);
        // If active household was persisted but no longer exists, clear it
        if (activeHousehold && !list.find((h) => h.id === activeHousehold.id)) {
          setActiveHousehold(null);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
