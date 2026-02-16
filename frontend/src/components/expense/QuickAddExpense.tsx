import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { expenseService } from "@/services/expenseService";
import { categoryService } from "@/services/categoryService";
import { useHouseholdStore } from "@/store/householdStore";
import type { Category } from "@/types/category.types";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Select } from "@/ui/select";

interface Props {
  onSuccess: () => void;
}

export default function QuickAddExpense({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [shared, setShared] = useState(false);
  const [loading, setLoading] = useState(false);
  const activeHousehold = useHouseholdStore((s) => s.activeHousehold);

  useEffect(() => {
    if (open && categories.length === 0) {
      categoryService.getAll().then(setCategories).catch(console.error);
    }
  }, [open, categories.length]);

  const reset = () => {
    setCategoryId("");
    setAmount("");
    setShared(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await expenseService.create({
        categoryId: parseInt(categoryId),
        amount: parseFloat(amount),
        expenseDate: new Date().toISOString().split("T")[0],
        ...(activeHousehold && shared
          ? { householdId: activeHousehold.id, shared: true }
          : {}),
      });
      reset();
      setOpen(false);
      onSuccess();
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating action button */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg cursor-pointer md:hidden"
        whileTap={{ scale: 0.9 }}
        aria-label="Quick add expense"
      >
        <Plus className="h-6 w-6" />
      </motion.button>

      {/* Bottom sheet overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-card border-t border-border p-5 pb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold">Quick Add</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-md hover:bg-muted cursor-pointer"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <Select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="">Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>

                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />

                <div className="flex gap-2">
                  {[5, 10, 20, 50].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAmount(String(v))}
                      className="flex-1 py-1.5 text-xs rounded-md bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                    >
                      ${v}
                    </button>
                  ))}
                </div>

                {activeHousehold && (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={shared}
                      onClick={() => setShared(!shared)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                        shared ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                          shared ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span className="text-sm text-muted-foreground">Shared</span>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Adding..." : "Add Expense"}
                </Button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
