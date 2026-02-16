import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Repeat } from "lucide-react";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { expenseService } from "@/services/expenseService";
import ExpenseCommentSection from "./ExpenseCommentSection";
import type { Expense } from "@/types/expense.types";

interface Props {
  expenses: Expense[];
  onUpdate: () => void;
}

export default function ExpenseList({ expenses, onUpdate }: Props) {
  const handleDelete = async (id: number) => {
    try {
      await expenseService.delete(id);
      onUpdate();
    } catch {
      // handled by interceptor
    }
  };

  if (expenses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-muted mb-4">
          <ClipboardList className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">No expenses this month. Start tracking!</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {expenses.map((exp, i) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: i * 0.03 }}
            className="p-4 rounded-lg border border-border bg-card hover:shadow-sm transition-shadow space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0 flex-wrap">
                <Badge variant="secondary">{exp.categoryName}</Badge>
                {exp.shared && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    Shared
                  </Badge>
                )}
                {exp.recurring && (
                  <span title="Recurring" className="text-muted-foreground">
                    <Repeat className="h-3 w-3" />
                  </span>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {exp.description ?? "No description"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(exp.expenseDate)}
                    {exp.ownerName && ` · ${exp.ownerName}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-semibold">{formatCurrency(exp.amount)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(exp.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  &times;
                </Button>
              </div>
            </div>

            {exp.shared && <ExpenseCommentSection expenseId={exp.id} />}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
