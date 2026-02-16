import { useHouseholdStore } from "@/store/householdStore";
import { Home, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HouseholdSwitcher() {
  const { households, activeHousehold, setActiveHousehold } =
    useHouseholdStore();

  if (households.length === 0) return null;

  return (
    <div className="px-3 py-3 border-t border-border space-y-1">
      <p className="px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
        Context
      </p>
      <button
        onClick={() => setActiveHousehold(null)}
        className={cn(
          "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
          !activeHousehold
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
      >
        <User className="h-4 w-4" />
        Personal
      </button>
      {households.map((h) => (
        <button
          key={h.id}
          onClick={() => setActiveHousehold(h)}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer truncate",
            activeHousehold?.id === h.id
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <Home className="h-4 w-4 shrink-0" />
          <span className="truncate">{h.name}</span>
        </button>
      ))}
    </div>
  );
}
