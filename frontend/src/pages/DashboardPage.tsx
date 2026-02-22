import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import BudgetOverview from "@/components/dashboard/BudgetOverview";
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";
import SpendingChart from "@/components/dashboard/SpendingChart";
import HouseholdSummary from "@/components/dashboard/HouseholdSummary";
import FairShareComparison from "@/components/dashboard/FairShareComparison";
import ContributionComparison from "@/components/dashboard/ContributionComparison";
import PendingInvitations from "@/components/household/PendingInvitations";
import HouseholdNotes from "@/components/household/HouseholdNotes";
import OnboardingFlow from "@/components/common/OnboardingFlow";
import QuickAddExpense from "@/components/expense/QuickAddExpense";
import MonthPicker from "@/components/common/MonthPicker";
import { dashboardService } from "@/services/dashboardService";
import { householdService } from "@/services/householdService";
import { useHouseholdStore } from "@/store/householdStore";
import { useAuthStore } from "@/store/authStore";
import { useFormatCurrency } from "@/lib/formatters";
import type { DashboardSummary } from "@/types/dashboard.types";
import type { HouseholdDashboardSummary, Invitation } from "@/types/household.types";

export default function DashboardPage() {
  const formatCurrency = useFormatCurrency();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [householdSummary, setHouseholdSummary] = useState<HouseholdDashboardSummary | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [onboardingDismissed, setOnboardingDismissed] = useState(
    () => localStorage.getItem("onboarding_dismissed") === "true"
  );
  const activeHousehold = useHouseholdStore((s) => s.activeHousehold);
  const households = useHouseholdStore((s) => s.households);
  const user = useAuthStore((s) => s.user);

  const fetchInvitations = useCallback(() => {
    householdService.getPendingInvitations().then(setInvitations).catch(() => {});
  }, []);

  const fetchData = useCallback(() => {
    setLoading(true);
    if (activeHousehold) {
      householdService
        .getHouseholdDashboard(activeHousehold.id, month, year)
        .then(setHouseholdSummary)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      dashboardService
        .getSummary(month, year)
        .then(setSummary)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [month, year, activeHousehold]);

  useEffect(fetchData, [fetchData]);
  useEffect(fetchInvitations, [fetchInvitations]);

  // Compute onboarding steps
  const completedSteps: number[] = [];
  if (user?.monthlyIncome && user.monthlyIncome > 0) completedSteps.push(0);
  if (households.length > 0) completedSteps.push(1);
  if (households.some((h) => h.memberCount > 1)) completedSteps.push(2);
  if (summary && summary.totalSpent > 0) completedSteps.push(3);

  // Budget percentage
  const spentPct =
    summary && summary.monthlyIncome > 0
      ? (summary.totalSpent / summary.monthlyIncome) * 100
      : 0;

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      </AppLayout>
    );
  }

  // Household dashboard
  if (activeHousehold && householdSummary) {
    return (
      <AppLayout>
        <div className="p-4 md:p-6 space-y-5 max-w-4xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-bold">{householdSummary.householdName}</h1>
              <p className="text-sm text-muted-foreground">
                {householdSummary.memberCount} members · Day {householdSummary.daysElapsed} of{" "}
                {householdSummary.totalDaysInMonth}
              </p>
            </div>
            <MonthPicker
              month={month}
              year={year}
              onChange={(m, y) => { setMonth(m); setYear(y); }}
            />
          </div>

          {invitations.length > 0 && (
            <PendingInvitations invitations={invitations} onUpdate={fetchInvitations} />
          )}

          {/* Household budget alert banner */}
          {householdSummary.monthlyBudget != null && householdSummary.monthlyBudget > 0 && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
              {householdSummary.overBudget ? (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive text-sm">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Household has exceeded the monthly budget of {formatCurrency(householdSummary.monthlyBudget)}. Review spending.</span>
                </div>
              ) : householdSummary.riskAlert ? (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-warning/50 bg-warning/10 text-warning text-sm">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>At this pace, household will exceed the {formatCurrency(householdSummary.monthlyBudget)} budget. Consider slowing down.</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-success/50 bg-success/10 text-success text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Household spending is on track. {formatCurrency(householdSummary.remaining)} remaining of {formatCurrency(householdSummary.monthlyBudget)} budget.</span>
                </div>
              )}
            </motion.div>
          )}

          <HouseholdSummary data={householdSummary} />

          <ContributionComparison
            members={householdSummary.memberBreakdown}
            currentUserId={user?.id}
          />

          <FairShareComparison
            members={householdSummary.memberBreakdown}
            fairShare={householdSummary.fairSharePerMember}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <CategoryBreakdown data={householdSummary.categoryBreakdown} />
            <SpendingChart data={householdSummary.categoryBreakdown} />
          </div>

          <HouseholdNotes householdId={activeHousehold.id} />
        </div>

        <QuickAddExpense onSuccess={fetchData} />
      </AppLayout>
    );
  }

  // Personal dashboard
  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-5 max-w-4xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Your financial overview</p>
          </div>
          <MonthPicker
            month={month}
            year={year}
            onChange={(m, y) => { setMonth(m); setYear(y); }}
          />
        </div>

        {!onboardingDismissed && completedSteps.length < 4 && (
          <OnboardingFlow
            completedSteps={completedSteps}
            onDismiss={() => {
              setOnboardingDismissed(true);
              localStorage.setItem("onboarding_dismissed", "true");
            }}
          />
        )}

        {invitations.length > 0 && (
          <PendingInvitations invitations={invitations} onUpdate={fetchInvitations} />
        )}

        {/* Budget alert banner */}
        {summary && summary.monthlyIncome > 0 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            {spentPct >= 100 ? (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>You've exceeded your monthly budget. Review your spending.</span>
              </div>
            ) : spentPct >= 80 ? (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-warning/50 bg-warning/10 text-warning text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>You've used {spentPct.toFixed(0)}% of your budget. Consider slowing down.</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-success/50 bg-success/10 text-success text-sm">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>You've used {spentPct.toFixed(1)}% of your budget. You're on track.</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Compact stats row */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between rounded-lg border border-border bg-card p-3 sm:p-4 text-sm"
          >
            <div className="text-center flex-1 min-w-0">
              <p className="text-muted-foreground text-xs">Income</p>
              <p className="font-semibold text-sm sm:text-base tabular-nums truncate">{formatCurrency(summary.monthlyIncome)}</p>
            </div>
            <div className="h-8 w-px bg-border shrink-0" />
            <div className="text-center flex-1 min-w-0">
              <p className="text-muted-foreground text-xs">Spent</p>
              <p className="font-semibold text-sm sm:text-base tabular-nums text-destructive truncate">{formatCurrency(summary.totalSpent)}</p>
            </div>
            <div className="h-8 w-px bg-border shrink-0" />
            <div className="text-center flex-1 min-w-0">
              <p className="text-muted-foreground text-xs">Remaining</p>
              <p className="font-semibold text-sm sm:text-base tabular-nums text-success truncate">{formatCurrency(summary.remaining)}</p>
            </div>
          </motion.div>
        )}

        <BudgetOverview summary={summary} />

        <CategoryBreakdown data={summary?.categoryBreakdown ?? []} />
      </div>

      <QuickAddExpense onSuccess={fetchData} />
    </AppLayout>
  );
}
