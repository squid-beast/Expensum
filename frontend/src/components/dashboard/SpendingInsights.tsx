import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { useFormatCurrency, formatPercent } from "@/lib/formatters";
import { MapPin, UtensilsCrossed, TrendingUp, PartyPopper, Target, Lightbulb, Sparkles } from "lucide-react";
import type { DashboardSummary } from "@/types/dashboard.types";
import type { LucideIcon } from "lucide-react";

interface Props {
  summary: DashboardSummary;
}

interface Insight {
  icon: LucideIcon;
  text: string;
  type: "info" | "warning" | "success";
}

function generateInsights(s: DashboardSummary, formatCurrency: (n: number) => string): Insight[] {
  const insights: Insight[] = [];
  const spentPct = s.monthlyIncome > 0 ? (s.totalSpent / s.monthlyIncome) * 100 : 0;

  if (s.categoryBreakdown.length > 0) {
    const top = s.categoryBreakdown[0];
    insights.push({
      icon: MapPin,
      text: `Your top spending category is ${top.categoryName} at ${formatCurrency(top.amount)} (${formatPercent(top.percentage)} of total spending).`,
      type: "info",
    });
  }

  const foodCats = s.categoryBreakdown.filter(
    (c) => c.categoryName === "DoorDash" || c.categoryName === "Uber Eats"
  );
  if (foodCats.length > 0) {
    const foodTotal = foodCats.reduce((sum, c) => sum + c.amount, 0);
    const foodPct = s.monthlyIncome > 0 ? (foodTotal / s.monthlyIncome) * 100 : 0;
    if (foodPct > 15) {
      insights.push({
        icon: UtensilsCrossed,
        text: `Food delivery is ${formatCurrency(foodTotal)} (${formatPercent(foodPct)} of income). Cooking at home could save you ${formatCurrency(foodTotal * 0.6)}/month.`,
        type: "warning",
      });
    }
  }

  if (s.riskAlert) {
    const overBy = s.projectedSpend - s.monthlyIncome;
    insights.push({
      icon: TrendingUp,
      text: `At this pace, you'll overspend by ${formatCurrency(overBy)} this month. Try to keep daily spending under ${formatCurrency((s.remaining) / (s.totalDaysInMonth - s.daysElapsed))}.`,
      type: "warning",
    });
  }

  if (spentPct < 50 && s.daysElapsed > 15) {
    insights.push({
      icon: PartyPopper,
      text: `Great job! You've used only ${formatPercent(spentPct)} of your budget past the halfway mark.`,
      type: "success",
    });
  }

  if (s.savingsGoal && s.savingsGoal > 0) {
    const canSave = s.remaining;
    if (canSave >= s.savingsGoal) {
      insights.push({
        icon: Target,
        text: `You're on track to meet your ${formatCurrency(s.savingsGoal)} savings goal this month!`,
        type: "success",
      });
    } else {
      insights.push({
        icon: Lightbulb,
        text: `You need to cut ${formatCurrency(s.savingsGoal - canSave)} more to hit your savings goal.`,
        type: "warning",
      });
    }
  }

  if (s.totalSpent === 0) {
    insights.push({
      icon: Sparkles,
      text: "No expenses tracked yet this month. Start adding to get personalized insights!",
      type: "info",
    });
  }

  return insights.slice(0, 4);
}

const typeColors = {
  info: "border-l-primary/50 bg-primary/5",
  warning: "border-l-warning/50 bg-warning/5",
  success: "border-l-success/50 bg-success/5",
};

const typeIconColors = {
  info: "text-primary",
  warning: "text-warning",
  success: "text-success",
};

export default function SpendingInsights({ summary }: Props) {
  const formatCurrency = useFormatCurrency();
  const insights = generateInsights(summary, formatCurrency);

  if (insights.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.35 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            Smart Insights <span className="text-sm font-normal text-muted-foreground">powered by your data</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.map((insight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${typeColors[insight.type]}`}
            >
              <insight.icon className={`h-4 w-4 shrink-0 mt-0.5 ${typeIconColors[insight.type]}`} />
              <span className="text-sm">{insight.text}</span>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
