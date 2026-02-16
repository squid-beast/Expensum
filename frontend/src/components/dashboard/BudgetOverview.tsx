import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Progress } from "@/ui/progress";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { AlertTriangle } from "lucide-react";
import type { DashboardSummary } from "@/types/dashboard.types";

interface Props {
  summary: DashboardSummary | null;
}

export default function BudgetOverview({ summary }: Props) {
  if (!summary) return null;

  const spentPct = summary.monthlyIncome > 0
    ? (summary.totalSpent / summary.monthlyIncome) * 100
    : 0;

  const projectedPct = summary.monthlyIncome > 0
    ? (summary.projectedSpend / summary.monthlyIncome) * 100
    : 0;

  const getStatusLabel = () => {
    if (spentPct > 100) return { text: "Over budget", className: "text-destructive" };
    if (spentPct > 80) return { text: "Nearing limit", className: "text-warning" };
    if (spentPct > 60) return { text: "On pace", className: "text-muted-foreground" };
    return { text: "On track", className: "text-success" };
  };

  const status = getStatusLabel();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.35 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Budget Overview</span>
            <span className={`text-sm font-medium ${status.className}`}>{status.text}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Spent this month</span>
              <span className="font-medium">
                {formatCurrency(summary.totalSpent)} / {formatCurrency(summary.monthlyIncome)}
              </span>
            </div>
            <Progress
              value={Math.min(spentPct, 100)}
              indicatorClassName={spentPct > 100 ? "bg-destructive" : spentPct > 80 ? "bg-warning" : "bg-primary"}
            />
            <p className="text-xs text-muted-foreground mt-1">{formatPercent(spentPct)} used</p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Daily Average</p>
              <p className="text-sm font-semibold">{formatCurrency(summary.dailyAverage)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Projected</p>
              <p className={`text-sm font-semibold ${summary.riskAlert ? "text-destructive" : ""}`}>
                {formatCurrency(summary.projectedSpend)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Days Left</p>
              <p className="text-sm font-semibold">{summary.totalDaysInMonth - summary.daysElapsed}</p>
            </div>
          </div>

          {summary.riskAlert && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/30 text-sm"
            >
              <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-warning">Heads up — </span>
                <span className="text-warning/80">
                  At this pace, you're projected to spend {formatCurrency(summary.projectedSpend)} —{" "}
                  {formatPercent(projectedPct)} of your income.
                </span>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
