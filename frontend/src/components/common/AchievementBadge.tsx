import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Clapperboard, Brain, PiggyBank, BarChart3, ChefHat, Palette, Lock } from "lucide-react";
import { dashboardService } from "@/services/dashboardService";
import type { DashboardSummary } from "@/types/dashboard.types";
import type { LucideIcon } from "lucide-react";

interface Achievement {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  earned: boolean;
}

function computeAchievements(s: DashboardSummary): Achievement[] {
  const spentPct = s.monthlyIncome > 0 ? (s.totalSpent / s.monthlyIncome) * 100 : 0;
  const totalTx = s.categoryBreakdown.reduce((sum, c) => sum + c.transactionCount, 0);
  const foodCats = s.categoryBreakdown.filter(
    (c) => c.categoryName === "DoorDash" || c.categoryName === "Uber Eats"
  );
  const foodTx = foodCats.reduce((sum, c) => sum + c.transactionCount, 0);

  return [
    {
      id: "first-expense",
      icon: Clapperboard,
      title: "First Step",
      description: "Tracked your first expense",
      earned: totalTx > 0,
    },
    {
      id: "budget-conscious",
      icon: Brain,
      title: "Budget Conscious",
      description: "Stayed under 50% of income",
      earned: s.daysElapsed >= 15 && spentPct < 50,
    },
    {
      id: "saver",
      icon: PiggyBank,
      title: "Super Saver",
      description: "Under 30% of income spent",
      earned: s.daysElapsed >= 20 && spentPct < 30,
    },
    {
      id: "tracker-10",
      icon: BarChart3,
      title: "Diligent Tracker",
      description: "Tracked 10+ expenses this month",
      earned: totalTx >= 10,
    },
    {
      id: "no-delivery",
      icon: ChefHat,
      title: "Home Chef",
      description: "Less than 3 food deliveries this month",
      earned: s.daysElapsed >= 7 && foodTx < 3,
    },
    {
      id: "diversified",
      icon: Palette,
      title: "Diversified Spender",
      description: "Expenses across 5+ categories",
      earned: s.categoryBreakdown.length >= 5,
    },
  ];
}

export default function AchievementBadge() {
  const [open, setOpen] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [fetched, setFetched] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fetch dashboard to compute achievements
  useEffect(() => {
    const now = new Date();
    dashboardService
      .getSummary(now.getMonth() + 1, now.getFullYear())
      .then((summary) => {
        setAchievements(computeAchievements(summary));
        setFetched(true);
      })
      .catch(() => setFetched(true));
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const earned = achievements.filter((a) => a.earned);
  const locked = achievements.filter((a) => !a.earned);
  const count = earned.length;

  if (!fetched) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
        aria-label="Achievements"
      >
        <Trophy className="h-5 w-5 text-muted-foreground" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
            {count}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-card shadow-lg z-50"
          >
            <div className="p-4 border-b border-border">
              <p className="text-sm font-semibold flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                Achievements
                <span className="text-xs font-normal text-muted-foreground">
                  {count}/{achievements.length}
                </span>
              </p>
            </div>
            <div className="max-h-80 overflow-y-auto p-3 space-y-2">
              {earned.length > 0 && (
                <>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium px-1">
                    Earned
                  </p>
                  {earned.map((a, i) => (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-primary/5 border border-primary/15"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <a.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{a.title}</p>
                        <p className="text-xs text-muted-foreground">{a.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </>
              )}

              {locked.length > 0 && (
                <>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium px-1 mt-3">
                    Locked
                  </p>
                  {locked.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 border border-border opacity-50"
                    >
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{a.title}</p>
                        <p className="text-xs text-muted-foreground">{a.description}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
