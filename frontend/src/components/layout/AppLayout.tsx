import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import AppSidebar from "./AppSidebar";
import { useAuthStore } from "@/store/authStore";
import { userService } from "@/services/userService";
import { useHouseholdStore } from "@/store/householdStore";
import { householdService } from "@/services/householdService";
import FloatingActionMenu, { type FloatingAction } from "@/ui/floating-action-menu";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import NotificationBell from "@/components/common/NotificationBell";
import MemberPresence from "@/components/dashboard/MemberPresence";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, setUser, isAuthenticated } = useAuthStore();
  const { setHouseholds, activeHousehold, setActiveHousehold } =
    useHouseholdStore();
  const navigate = useNavigate();

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
        if (activeHousehold && !list.find((h) => h.id === activeHousehold.id)) {
          setActiveHousehold(null);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fabActions: FloatingAction[] = [
    {
      icon: <Plus className="h-5 w-5" />,
      label: "Add Expense",
      onClick: () => navigate("/expenses"),
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/95 backdrop-blur-sm px-4 md:px-6">
            {/* Hamburger — mobile only */}
            <SidebarTrigger className="md:hidden" />
            <div className="h-5 w-px bg-border md:hidden" />

            {/* Left side */}
            <div className="flex items-center gap-3 flex-1">
              {activeHousehold && <MemberPresence householdId={activeHousehold.id} />}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <NotificationBell />
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>

      <FloatingActionMenu actions={fabActions} />
    </SidebarProvider>
  );
}
