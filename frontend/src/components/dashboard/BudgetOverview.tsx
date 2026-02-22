import { motion } from "framer-motion";
import { Progress } from "@/ui/progress";
import { useFormatCurrency, formatPercent } from "@/lib/formatters";
import type { DashboardSummary } from "@/types/dashboard.types";

interface Props {
  summary: DashboardSummary | null;
}

export default function BudgetOverview({ summary }: Props) {
  const formatCurrency = useFormatCurrency();
  if (!summary || summary.monthlyIncome <= 0) return null;

  const spentPct = (summary.totalSpent / summary.monthlyIncome) * 100;
  const daysLeft = summary.totalDaysInMonth - summary.daysElapsed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      className="space-y-2"
    >
      {/* Progress bar */}
      <div className="flex justify-between text-sm mb-1">
        <span className="text-muted-foreground">
          {formatCurrency(summary.totalSpent)} of {formatCurrency(summary.monthlyIncome)}
        </span>
        <span className="font-medium tabular-nums">{formatPercent(spentPct)}</span>
      </div>
      <Progress
        value={Math.min(spentPct, 100)}
        indicatorClassName={
          spentPct > 100 ? "bg-destructive" : spentPct > 80 ? "bg-warning" : "bg-primary"
        }
      />

      {/* Compact stats row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
        <span>Daily avg: <span className="font-medium text-foreground">{formatCurrency(summary.dailyAverage)}</span></span>
        <span>Projected: <span className={`font-medium ${spentPct > 80 ? "text-warning" : "text-foreground"}`}>{formatCurrency(summary.projectedSpend)}</span></span>
        <span>{daysLeft} days left</span>
      </div>
    </motion.div>
  );
}
