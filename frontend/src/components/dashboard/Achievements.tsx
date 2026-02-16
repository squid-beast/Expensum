import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Clapperboard, Brain, PiggyBank, BarChart3, ChefHat, Palette, Lock } from "lucide-react";
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

interface Props {
  summary: DashboardSummary;
}

export default function Achievements({ summary }: Props) {
  const achievements = computeAchievements(summary);
  const earned = achievements.filter((a) => a.earned);
  const locked = achievements.filter((a) => !a.earned);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.35 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            Achievements
            <span className="text-sm font-normal text-muted-foreground">
              {earned.length}/{achievements.length} earned
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {earned.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.08, type: "spring", stiffness: 200 }}
                className="flex flex-col items-center text-center p-3 rounded-xl bg-primary/5 border border-primary/20"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mb-1.5">
                  <a.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs font-semibold">{a.title}</span>
                <span className="text-[10px] text-muted-foreground">{a.description}</span>
              </motion.div>
            ))}
            {locked.map((a) => (
              <div
                key={a.id}
                className="flex flex-col items-center text-center p-3 rounded-xl bg-muted/50 border border-border opacity-40"
              >
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mb-1.5">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="text-xs font-semibold">{a.title}</span>
                <span className="text-[10px] text-muted-foreground">{a.description}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
