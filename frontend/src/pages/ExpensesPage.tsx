import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import ExpenseForm from "@/components/expense/ExpenseForm";
import ExpenseList from "@/components/expense/ExpenseList";
import QuickAddExpense from "@/components/expense/QuickAddExpense";
import MonthPicker from "@/components/common/MonthPicker";
import { expenseService } from "@/services/expenseService";
import { useHouseholdStore } from "@/store/householdStore";
import type { Expense } from "@/types/expense.types";
import { Button } from "@/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export default function ExpensesPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expenseType, setExpenseType] = useState<"personal" | "shared" | "all">("personal");
  const activeHousehold = useHouseholdStore((s) => s.activeHousehold);

  const fetchExpenses = useCallback(() => {
    setLoading(true);
    expenseService
      .getAll(
        month,
        year,
        activeHousehold?.id,
        activeHousehold ? expenseType : undefined
      )
      .then(setExpenses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [month, year, activeHousehold, expenseType]);

  useEffect(fetchExpenses, [fetchExpenses]);

  const handleSuccess = () => {
    setShowForm(false);
    fetchExpenses();
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 max-w-4xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">Expenses</h1>
            <p className="text-sm text-muted-foreground">
              {expenses.length} transactions &middot;{" "}
              {formatCurrency(expenses.reduce((s, e) => s + e.amount, 0))} total
            </p>
          </div>
          <div className="flex items-center gap-3">
            <MonthPicker
              month={month}
              year={year}
              onChange={(m, y) => { setMonth(m); setYear(y); }}
            />
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancel" : "+ Add Expense"}
            </Button>
          </div>
        </div>

        {activeHousehold && (
          <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
            {(["personal", "shared", "all"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setExpenseType(t)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer capitalize",
                  expenseType === t
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="border border-border rounded-xl p-5 bg-card">
                <ExpenseForm onSuccess={handleSuccess} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : (
          <ExpenseList expenses={expenses} onUpdate={fetchExpenses} />
        )}
      </motion.div>

      <QuickAddExpense onSuccess={fetchExpenses} />
    </AppLayout>
  );
}
