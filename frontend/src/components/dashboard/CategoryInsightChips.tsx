import { motion } from "framer-motion";
import { formatPercent } from "@/lib/formatters";
import type { CategoryBreakdown } from "@/types/dashboard.types";

interface Props {
  data: CategoryBreakdown[];
}

export default function CategoryInsightChips({ data }: Props) {
  if (data.length === 0) return null;

  const insights: string[] = [];

  // Largest category
  const top = data[0];
  if (top) {
    insights.push(`${top.categoryName} is ${formatPercent(top.percentage)} of spending`);
  }

  // Any category over 30%
  const heavy = data.find((c) => c.percentage > 30 && c !== top);
  if (heavy) {
    insights.push(`${heavy.categoryName} is ${formatPercent(heavy.percentage)} of spending`);
  }

  // Food delivery check
  const delivery = data.filter(
    (c) => c.categoryName === "DoorDash" || c.categoryName === "Uber Eats"
  );
  if (delivery.length > 0) {
    const pct = delivery.reduce((s, c) => s + c.percentage, 0);
    if (pct > 10) {
      insights.push(`Food delivery is ${formatPercent(pct)} of spending`);
    }
  }

  // Small category
  const smallest = data.length > 2 ? data[data.length - 1] : null;
  if (smallest && smallest.percentage < 5) {
    insights.push(`${smallest.categoryName} is the smallest at ${formatPercent(smallest.percentage)}`);
  }

  if (insights.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="flex flex-wrap gap-2"
    >
      {insights.slice(0, 3).map((text, i) => (
        <span
          key={i}
          className="inline-flex items-center rounded-full bg-primary/5 border border-primary/10 px-3 py-1 text-xs text-muted-foreground"
        >
          {text}
        </span>
      ))}
    </motion.div>
  );
}
