import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import type { CategoryBreakdown as CBType } from "@/types/dashboard.types";

const BAR_COLORS = [
  "bg-indigo-500", "bg-pink-500", "bg-emerald-500", "bg-amber-500",
  "bg-cyan-500", "bg-violet-500", "bg-rose-500", "bg-teal-500",
  "bg-orange-500", "bg-slate-500",
];

const DOT_COLORS = [
  "bg-indigo-500", "bg-pink-500", "bg-emerald-500", "bg-amber-500",
  "bg-cyan-500", "bg-violet-500", "bg-rose-500", "bg-teal-500",
  "bg-orange-500", "bg-slate-500",
];

interface Props {
  data: CBType[];
}

export default function CategoryBreakdown({ data }: Props) {
  const maxAmount = data.length > 0 ? Math.max(...data.map((c) => c.amount)) : 0;
  const total = data.reduce((sum, c) => sum + c.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Spending by Category</CardTitle>
            {total > 0 && (
              <span className="text-sm text-muted-foreground font-medium">
                {formatCurrency(total)} total
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {data.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No expenses yet this month
            </p>
          ) : (
            <div className="space-y-4">
              {data.map((cat, i) => (
                <motion.div
                  key={cat.categoryId}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.06, duration: 0.35 }}
                >
                  {/* Row: dot + name on left, amount on right */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${DOT_COLORS[i % DOT_COLORS.length]}`} />
                      <span className="text-sm font-medium truncate">{cat.categoryName}</span>
                      <span className="text-xs text-muted-foreground">
                        {cat.transactionCount} {cat.transactionCount === 1 ? "txn" : "txns"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className="text-sm font-semibold tabular-nums">
                        {formatCurrency(cat.amount)}
                      </span>
                      <span className="text-xs text-muted-foreground w-12 text-right tabular-nums">
                        {formatPercent(cat.percentage)}
                      </span>
                    </div>
                  </div>

                  {/* Bar — width proportional to max category */}
                  <div className="h-3 rounded-md bg-secondary/60 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: maxAmount > 0 ? `${(cat.amount / maxAmount) * 100}%` : "0%",
                      }}
                      transition={{
                        delay: 0.6 + i * 0.06,
                        duration: 0.7,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      className={`h-full rounded-md ${BAR_COLORS[i % BAR_COLORS.length]}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
