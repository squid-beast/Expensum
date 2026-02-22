import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Wallet, Edit3, Check, X } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuthStore } from "@/store/authStore";
import { userService } from "@/services/userService";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/ui/card";
import { useFormatCurrency } from "@/lib/formatters";

export default function IncomeSetupPage() {
  const formatCurrency = useFormatCurrency();
  const { user, setUser } = useAuthStore();
  const [income, setIncome] = useState("");
  const [savingsGoal, setSavingsGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  const hasIncome = user && user.monthlyIncome > 0;

  useEffect(() => {
    if (user) {
      if (user.monthlyIncome > 0) setIncome(String(user.monthlyIncome));
      if (user.savingsGoal) setSavingsGoal(String(user.savingsGoal));
    }
  }, [user]);

  const startEditing = () => {
    setIncome(String(user?.monthlyIncome ?? 0));
    setSavingsGoal(user?.savingsGoal != null ? String(user.savingsGoal) : "");
    setSuccess(false);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setSuccess(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await userService.updateIncome({
        monthlyIncome: parseFloat(income),
        savingsGoal: savingsGoal ? parseFloat(savingsGoal) : undefined,
      });
      setUser(updated);
      setSuccess(true);
      if (!hasIncome) {
        // First time setup — redirect to dashboard
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        // Editing existing — go back to view after a moment
        setTimeout(() => {
          setEditing(false);
          setSuccess(false);
        }, 1200);
      }
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  // If income is already set and not editing — show the overview
  if (hasIncome && !editing) {
    return (
      <AppLayout>
        <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Income
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Your monthly budget configuration
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Budget Details</CardTitle>
                  <Button variant="ghost" size="sm" onClick={startEditing}>
                    <Edit3 className="h-3.5 w-3.5 mr-1.5" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Monthly Income</span>
                  <span className="text-sm font-semibold tabular-nums">
                    {formatCurrency(user.monthlyIncome)}
                  </span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Savings Goal</span>
                  <span className="text-sm font-semibold tabular-nums">
                    {user.savingsGoal != null && user.savingsGoal > 0
                      ? formatCurrency(user.savingsGoal)
                      : "Not set"}
                  </span>
                </div>
                {user.savingsGoal != null && user.savingsGoal > 0 && (
                  <>
                    <div className="h-px bg-border" />
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">Spendable Budget</span>
                      <span className="text-sm font-semibold tabular-nums text-primary">
                        {formatCurrency(user.monthlyIncome - user.savingsGoal)}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  // First-time setup or editing mode — show the form
  return (
    <AppLayout>
      <div className={hasIncome ? "p-4 sm:p-6 max-w-2xl mx-auto space-y-5" : "flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 sm:p-6"}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={hasIncome ? "" : "w-full max-w-lg"}
        >
          {hasIncome && (
            <div className="mb-5">
              <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Edit Income
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Update your monthly budget settings
              </p>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>{hasIncome ? "Update Budget" : "Set Up Your Budget"}</CardTitle>
              <CardDescription>
                {hasIncome
                  ? "Modify your monthly income and savings goal"
                  : "Tell us your monthly income so we can help you track spending"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="income">Monthly Income ($)</Label>
                  <Input
                    id="income"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="5000.00"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="savings">Monthly Savings Goal ($) — Optional</Label>
                  <Input
                    id="savings"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="1000.00"
                    value={savingsGoal}
                    onChange={(e) => setSavingsGoal(e.target.value)}
                  />
                </div>

                {success && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 rounded-lg bg-success/10 text-success text-sm text-center"
                  >
                    Saved! {hasIncome ? "" : "Redirecting to dashboard..."}
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    <Check className="h-4 w-4 mr-1.5" />
                    {loading ? "Saving..." : "Save"}
                  </Button>
                  {hasIncome && (
                    <Button type="button" variant="outline" onClick={cancelEditing}>
                      <X className="h-4 w-4 mr-1.5" />
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
