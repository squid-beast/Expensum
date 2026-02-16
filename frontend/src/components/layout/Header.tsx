import { useAuthStore } from "@/store/authStore";
import { useHouseholdStore } from "@/store/householdStore";
import NotificationBell from "@/components/common/NotificationBell";
import MemberPresence from "@/components/dashboard/MemberPresence";

export default function Header() {
  const user = useAuthStore((s) => s.user);
  const activeHousehold = useHouseholdStore((s) => s.activeHousehold);

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {activeHousehold && <MemberPresence householdId={activeHousehold.id} />}
      </div>
      <div className="flex items-center gap-3">
        <NotificationBell />
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
          {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
        </div>
        <span className="text-sm font-medium">{user?.fullName ?? "User"}</span>
      </div>
    </header>
  );
}
