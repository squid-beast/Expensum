import { useState, useEffect, type FormEvent } from "react";
import { expenseService } from "@/services/expenseService";
import { categoryService } from "@/services/categoryService";
import { useHouseholdStore } from "@/store/householdStore";
import type { Category } from "@/types/category.types";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select } from "@/ui/select";
import CelebrationOverlay from "@/components/common/CelebrationOverlay";

interface Props {
  onSuccess: () => void;
}

export default function ExpenseForm({ onSuccess }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]);
  const [shared, setShared] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [loading, setLoading] = useState(false);
  const activeHousehold = useHouseholdStore((s) => s.activeHousehold);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(console.error);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await expenseService.create({
        categoryId: parseInt(categoryId),
        amount: parseFloat(amount),
        description: description || undefined,
        expenseDate,
        recurring: recurring || undefined,
        ...(activeHousehold && shared
          ? { householdId: activeHousehold.id, shared: true }
          : {}),
      });
      setShowCelebration(true);
      setTimeout(() => onSuccess(), 800);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            id="category"
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
          <Label htmlFor="amount">Amount ($)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <div className="flex gap-2">
            {[5, 10, 20, 50, 100].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setAmount(String(v))}
                className="px-2.5 py-1 text-xs rounded-md bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
              >
                ${v}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="desc">Note (optional)</Label>
          <Input
            id="desc"
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
                Shared ({activeHousehold.name})
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

        <div className="relative">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Expense"}
          </Button>
        </div>
      </form>

      <CelebrationOverlay
        isVisible={showCelebration}
        onComplete={() => setShowCelebration(false)}
      />
    </div>
  );
}
