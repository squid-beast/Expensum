import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { useAuthStore } from "@/store/authStore";
import { userService } from "@/services/userService";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/ui/card";

export default function IncomeSetupPage() {
  const { user, setUser } = useAuthStore();
  const [income, setIncome] = useState("");
  const [savingsGoal, setSavingsGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.monthlyIncome > 0) setIncome(String(user.monthlyIncome));
      if (user.savingsGoal) setSavingsGoal(String(user.savingsGoal));
    }
  }, [user]);

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
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <Card>
            <CardHeader>
              <CardTitle>Set Up Your Budget</CardTitle>
              <CardDescription>
                Tell us your monthly income so we can help you track spending
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
                    Saved! Redirecting to dashboard...
                  </motion.div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Saving..." : "Save & Continue"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
