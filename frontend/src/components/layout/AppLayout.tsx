import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Sparkles } from "lucide-react";
import AppSidebar from "./AppSidebar";
import Header from "./Header";
import { useAuthStore } from "@/store/authStore";
import { userService } from "@/services/userService";
import { useHouseholdStore } from "@/store/householdStore";
import { householdService } from "@/services/householdService";
import FloatingActionMenu, { type FloatingAction } from "@/ui/floating-action-menu";
import ModalPricing from "@/ui/modal-pricing";
import FlyingBird from "@/components/common/FlyingBird";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, setUser, isAuthenticated } = useAuthStore();
  const { setHouseholds, activeHousehold, setActiveHousehold } =
    useHouseholdStore();
  const [pricingOpen, setPricingOpen] = useState(false);
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
        // If active household was persisted but no longer exists, clear it
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
    {
      icon: <Sparkles className="h-5 w-5" />,
      label: "Upgrade Plan",
      onClick: () => setPricingOpen(true),
      className: "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      <FloatingActionMenu actions={fabActions} />
      <ModalPricing open={pricingOpen} onOpenChange={setPricingOpen} />
      <FlyingBird />
    </div>
  );
}
