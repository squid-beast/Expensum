import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { dashboardService } from "@/services/dashboardService";
import { formatCurrency } from "@/lib/formatters";

interface Props {
  currentSpent: number;
  month: number;
  year: number;
}

export default function TrendIndicator({ currentSpent, month, year }: Props) {
  const [prevSpent, setPrevSpent] = useState<number | null>(null);

  useEffect(() => {
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    dashboardService
      .getSummary(prevMonth, prevYear)
      .then((s) => setPrevSpent(s.totalSpent))
      .catch(() => setPrevSpent(null));
  }, [month, year]);

  if (prevSpent === null || prevSpent === 0) return null;

  const diff = currentSpent - prevSpent;
  const pct = Math.abs((diff / prevSpent) * 100);

  let icon = Minus;
  let color = "text-muted-foreground";
  let text = "Spending is about the same as last month";

  if (diff > 0 && pct > 5) {
    icon = TrendingUp;
    color = "text-warning";
    text = `Spending is ${formatCurrency(diff)} higher than last month`;
  } else if (diff < 0 && pct > 5) {
    icon = TrendingDown;
    color = "text-success";
    text = `Spending is ${formatCurrency(Math.abs(diff))} lower than last month`;
  }

  const Icon = icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.25 }}
      className="flex items-center gap-2"
    >
      <Icon className={`h-4 w-4 ${color}`} />
      <span className="text-xs text-muted-foreground">{text}</span>
    </motion.div>
  );
}
