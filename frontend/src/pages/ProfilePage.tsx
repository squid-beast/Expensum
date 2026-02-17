import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  DollarSign,
  PiggyBank,
  Home,
  Calendar,
  Shield,
  Loader2,
  Edit3,
  Check,
  X,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Badge } from "@/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { useHouseholdStore } from "@/store/householdStore";
import { userService } from "@/services/userService";
import { formatCurrency } from "@/lib/formatters";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const households = useHouseholdStore((s) => s.households);

  // Editable income fields
  const [editingIncome, setEditingIncome] = useState(false);
  const [incomeValue, setIncomeValue] = useState("");
  const [savingsValue, setSavingsValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    if (!user) {
      userService
        .getProfile()
        .then(setUser)
        .finally(() => setLoading(false));
    }
  }, [user, setUser]);

  const handleSaveIncome = async () => {
    setSaving(true);
    try {
      const updated = await userService.updateIncome({
        monthlyIncome: parseFloat(incomeValue) || 0,
        savingsGoal: savingsValue ? parseFloat(savingsValue) : undefined,
      });
      setUser(updated);
      setEditingIncome(false);
    } catch {
      // handled by interceptor
    } finally {
      setSaving(false);
    }
  };

  const startEditingIncome = () => {
    setIncomeValue(String(user?.monthlyIncome ?? 0));
    setSavingsValue(user?.savingsGoal != null ? String(user.savingsGoal) : "");
    setEditingIncome(true);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-5">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary shrink-0">
                  {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold truncate">{user?.fullName}</h1>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  {user?.phoneNumber && (
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{user.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Financial Overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Financial Overview
                </CardTitle>
                {!editingIncome && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={startEditingIncome}
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {editingIncome ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Monthly Income</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={incomeValue}
                      onChange={(e) => setIncomeValue(e.target.value)}
                      placeholder="5000.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Savings Goal (optional)</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={savingsValue}
                      onChange={(e) => setSavingsValue(e.target.value)}
                      placeholder="1000.00"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveIncome}
                      disabled={saving}
                    >
                      <Check className="h-4 w-4" />
                      {saving ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingIncome(false)}
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Monthly Income</p>
                      <p className="font-semibold">
                        {formatCurrency(user?.monthlyIncome ?? 0)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <PiggyBank className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Savings Goal</p>
                      <p className="font-semibold">
                        {user?.savingsGoal != null
                          ? formatCurrency(user.savingsGoal)
                          : "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Households */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Households
              </CardTitle>
            </CardHeader>
            <CardContent>
              {households.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  You haven't joined any households yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {households.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{h.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {h.memberCount} member{h.memberCount !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {h.createdById === user?.id ? "Owner" : "Member"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Full Name</p>
                    <p className="text-sm font-medium">{user?.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{user?.email}</p>
                  </div>
                </div>
                {user?.phoneNumber && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{user.phoneNumber}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Plan</p>
                    <p className="text-sm font-medium">Free / Basic</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
