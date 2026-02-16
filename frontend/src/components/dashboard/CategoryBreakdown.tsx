import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import type { CategoryBreakdown as CBType } from "@/types/dashboard.types";

const COLORS = [
  "bg-indigo-500", "bg-pink-500", "bg-emerald-500", "bg-amber-500",
  "bg-cyan-500", "bg-violet-500", "bg-rose-500", "bg-teal-500",
  "bg-orange-500", "bg-slate-500",
];

interface Props {
  data: CBType[];
}

export default function CategoryBreakdown({ data }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No expenses yet this month
            </p>
          ) : (
            data.map((cat, i) => (
              <motion.div
                key={cat.categoryId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="space-y-1"
              >
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{cat.categoryName}</span>
                  <span className="text-muted-foreground">
                    {formatCurrency(cat.amount)} ({formatPercent(cat.percentage)})
                  </span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percentage}%` }}
                    transition={{ delay: 0.6 + i * 0.05, duration: 0.6, ease: "easeOut" }}
                    className={`h-full rounded-full ${COLORS[i % COLORS.length]}`}
                  />
                </div>
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
