import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Repeat, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { expenseService } from "@/services/expenseService";
import ConfirmDialog from "@/ui/confirm-dialog";
import ExpenseEditModal from "@/components/expense/ExpenseEditModal";
import ExpenseCommentSection from "./ExpenseCommentSection";
import type { Expense } from "@/types/expense.types";

interface Props {
  expenses: Expense[];
  onUpdate: () => void;
}

export default function ExpenseList({ expenses, onUpdate }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [editTarget, setEditTarget] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await expenseService.delete(deleteTarget.id);
      setDeleteTarget(null);
      onUpdate();
    } catch {
      // handled by interceptor
    } finally {
      setDeleting(false);
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
    <>
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
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-semibold">{formatCurrency(exp.amount)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={() => setEditTarget(exp)}
                    title="Edit expense"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => setDeleteTarget(exp)}
                    title="Delete expense"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {exp.shared && <ExpenseCommentSection expenseId={exp.id} />}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Expense"
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.description ?? deleteTarget.categoryName}" (${formatCurrency(deleteTarget.amount)})? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        variant="destructive"
        loading={deleting}
        onConfirm={handleDelete}
      />

      {/* Edit Modal */}
      {editTarget && (
        <ExpenseEditModal
          expense={editTarget}
          open={!!editTarget}
          onOpenChange={(open) => !open && setEditTarget(null)}
          onSuccess={() => {
            setEditTarget(null);
            onUpdate();
          }}
        />
      )}
    </>
  );
}
