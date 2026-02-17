import { useState, useEffect, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select } from "@/ui/select";
import { expenseService } from "@/services/expenseService";
import { categoryService } from "@/services/categoryService";
import { useHouseholdStore } from "@/store/householdStore";
import type { Expense } from "@/types/expense.types";
import type { Category } from "@/types/category.types";

interface Props {
  expense: Expense;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function ExpenseEditModal({
  expense,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState(String(expense.categoryId));
  const [amount, setAmount] = useState(String(expense.amount));
  const [description, setDescription] = useState(expense.description ?? "");
  const [expenseDate, setExpenseDate] = useState(expense.expenseDate);
  const [shared, setShared] = useState(expense.shared);
  const [recurring, setRecurring] = useState(expense.recurring);
  const [loading, setLoading] = useState(false);
  const activeHousehold = useHouseholdStore((s) => s.activeHousehold);

  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(console.error);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await expenseService.update(expense.id, {
        categoryId: parseInt(categoryId),
        amount: parseFloat(amount),
        description: description || undefined,
        expenseDate,
        recurring: recurring || undefined,
        ...(activeHousehold && shared
          ? { householdId: activeHousehold.id, shared: true }
          : {}),
      });
      onSuccess();
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <Select
              id="edit-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-amount">Amount ($)</Label>
            <Input
              id="edit-amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-date">Date</Label>
            <Input
              id="edit-date"
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-desc">Note (optional)</Label>
            <Input
              id="edit-desc"
              placeholder="What was this for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6">
            {activeHousehold && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={shared}
                  onClick={() => setShared(!shared)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    shared ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                      shared ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <Label className="cursor-pointer" onClick={() => setShared(!shared)}>
                  Shared
                </Label>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={recurring}
                onClick={() => setRecurring(!recurring)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  recurring ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    recurring ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <Label className="cursor-pointer" onClick={() => setRecurring(!recurring)}>
                Recurring
              </Label>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
