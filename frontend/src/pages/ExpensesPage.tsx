import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import ExpenseForm from "@/components/expense/ExpenseForm";
import ExpenseList from "@/components/expense/ExpenseList";
import QuickAddExpense from "@/components/expense/QuickAddExpense";
import MonthPicker from "@/components/common/MonthPicker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/ui/dialog";
import { expenseService } from "@/services/expenseService";
import { useHouseholdStore } from "@/store/householdStore";
import type { Expense } from "@/types/expense.types";
import { Button } from "@/ui/button";
import { useFormatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export default function ExpensesPage() {
  const formatCurrency = useFormatCurrency();
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
      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold">Expenses</h1>
            <p className="text-sm text-muted-foreground">
              {expenses.length} transactions &middot;{" "}
              {formatCurrency(expenses.reduce((s, e) => s + e.amount, 0))} total
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <MonthPicker
              month={month}
              year={year}
              onChange={(m, y) => { setMonth(m); setYear(y); }}
            />
            <Button onClick={() => setShowForm(true)}>
              <span className="sm:hidden">+</span>
              <span className="hidden sm:inline">+ Add Expense</span>
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

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : (
          <ExpenseList expenses={expenses} onUpdate={fetchExpenses} />
        )}
      </div>

      {/* Add Expense Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogDescription>
              Fill in the details to log a new expense.
            </DialogDescription>
          </DialogHeader>
          <ExpenseForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>

      <QuickAddExpense onSuccess={fetchExpenses} />
    </AppLayout>
  );
}
