import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Loader2,
  Edit3,
  Check,
  X,
  Home,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar, AvatarFallback } from "@/ui/avatar";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Badge } from "@/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { useHouseholdStore } from "@/store/householdStore";
import { userService } from "@/services/userService";
import { useFormatCurrency } from "@/lib/formatters";

/** Format a phone string to US format: (XXX) XXX-XXXX */
function formatUSPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // Strip leading country code "1" if present
  const d = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (d.length === 10) {
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  }
  return phone; // Return as-is if not 10 digits
}

export default function ProfilePage() {
  const formatCurrency = useFormatCurrency();
  const { user, setUser } = useAuthStore();
  const households = useHouseholdStore((s) => s.households);

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

  const initial = user?.fullName?.charAt(0)?.toUpperCase() ?? "U";

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-0">
        {/* Profile header */}
        <div className="flex items-center gap-4 pb-6">
          <Avatar className="size-14">
            <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="text-xl font-bold truncate">{user?.fullName}</h1>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{user?.email}</span>
            </div>
            {user?.phoneNumber && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span>{formatUSPhone(user.phoneNumber)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Financial */}
        <div className="border-t border-border py-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Financial
            </h2>
            {!editingIncome && (
              <Button variant="ghost" size="sm" onClick={startEditingIncome}>
                <Edit3 className="h-3.5 w-3.5 mr-1.5" />
                Edit
              </Button>
            )}
          </div>

          {editingIncome ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="income" className="text-sm">Monthly Income</Label>
                <Input
                  id="income"
                  type="number"
                  step="0.01"
                  min="0"
                  value={incomeValue}
                  onChange={(e) => setIncomeValue(e.target.value)}
                  placeholder="5000.00"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="savings" className="text-sm">Savings Goal (optional)</Label>
                <Input
                  id="savings"
                  type="number"
                  step="0.01"
                  min="0"
                  value={savingsValue}
                  onChange={(e) => setSavingsValue(e.target.value)}
                  placeholder="1000.00"
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveIncome} disabled={saving}>
                  <Check className="h-3.5 w-3.5 mr-1" />
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingIncome(false)}
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground">Monthly Income</Label>
                <span className="text-sm font-medium tabular-nums">
                  {formatCurrency(user?.monthlyIncome ?? 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground">Savings Goal</Label>
                <span className="text-sm font-medium tabular-nums">
                  {user?.savingsGoal != null
                    ? formatCurrency(user.savingsGoal)
                    : "Not set"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Households */}
        <div className="border-t border-border py-5">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Households
          </h2>
          {households.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You haven't joined any households yet.
            </p>
          ) : (
            <div className="space-y-2">
              {households.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Home className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{h.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {h.memberCount} member{h.memberCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {h.createdById === user?.id ? "Owner" : "Member"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
