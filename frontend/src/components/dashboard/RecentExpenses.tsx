import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { RecentExpense } from "@/types/dashboard.types";

interface Props {
  expenses: RecentExpense[];
}

export default function RecentExpenses({ expenses }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No recent expenses
            </p>
          ) : (
            <div className="space-y-3">
              {expenses.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">
                      {exp.categoryName}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {exp.description ?? "No description"}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(exp.amount)}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(exp.expenseDate)}</p>
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
