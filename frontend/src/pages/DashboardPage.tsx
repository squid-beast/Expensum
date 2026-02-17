import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, CreditCard, Landmark, Loader2 } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import SummaryCard from "@/components/dashboard/SummaryCard";
import BudgetOverview from "@/components/dashboard/BudgetOverview";
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";
import SpendingChart from "@/components/dashboard/SpendingChart";
import RecentExpenses from "@/components/dashboard/RecentExpenses";
import SpendingInsights from "@/components/dashboard/SpendingInsights";
import Achievements from "@/components/dashboard/Achievements";
import HouseholdSummary from "@/components/dashboard/HouseholdSummary";
import FairShareComparison from "@/components/dashboard/FairShareComparison";
import ContributionComparison from "@/components/dashboard/ContributionComparison";
import CategoryInsightChips from "@/components/dashboard/CategoryInsightChips";
import TrendIndicator from "@/components/dashboard/TrendIndicator";
import ExportButton from "@/components/dashboard/ExportButton";
import PendingInvitations from "@/components/household/PendingInvitations";
import HouseholdNotes from "@/components/household/HouseholdNotes";
import OnboardingFlow from "@/components/common/OnboardingFlow";
import QuickAddExpense from "@/components/expense/QuickAddExpense";
import MonthPicker from "@/components/common/MonthPicker";
import { dashboardService } from "@/services/dashboardService";
import { householdService } from "@/services/householdService";
import { useHouseholdStore } from "@/store/householdStore";
import { useAuthStore } from "@/store/authStore";
import type { DashboardSummary } from "@/types/dashboard.types";
import type { HouseholdDashboardSummary, Invitation } from "@/types/household.types";
import { Alert, AlertDescription, AlertTitle } from "@/ui/alert";

export default function DashboardPage() {
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
  const [personalTab, setPersonalTab] = useState<"overview" | "analytics">("overview");
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
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold">{householdSummary.householdName}</h1>
              <p className="text-sm text-muted-foreground">
                {householdSummary.memberCount} members · Day {householdSummary.daysElapsed} of{" "}
                {householdSummary.totalDaysInMonth}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ExportButton
                month={month}
                year={year}
                householdId={activeHousehold.id}
                type="shared"
              />
              <MonthPicker
                month={month}
                year={year}
                onChange={(m, y) => { setMonth(m); setYear(y); }}
              />
            </div>
          </div>

          {invitations.length > 0 && (
            <PendingInvitations invitations={invitations} onUpdate={fetchInvitations} />
          )}

          <HouseholdSummary data={householdSummary} />

          <CategoryInsightChips data={householdSummary.categoryBreakdown} />

          <ContributionComparison
            members={householdSummary.memberBreakdown}
            currentUserId={user?.id}
          />

          <FairShareComparison
            members={householdSummary.memberBreakdown}
            fairShare={householdSummary.fairSharePerMember}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryBreakdown data={householdSummary.categoryBreakdown} />
            <SpendingChart data={householdSummary.categoryBreakdown} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentExpenses expenses={householdSummary.recentExpenses} />
            <HouseholdNotes householdId={activeHousehold.id} />
          </div>
        </div>

        <QuickAddExpense onSuccess={fetchData} />
      </AppLayout>
    );
  }

  // Personal dashboard
  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Your financial overview</p>
          </div>
          <div className="flex items-center gap-2">
            <ExportButton month={month} year={year} />
            <MonthPicker
              month={month}
              year={year}
              onChange={(m, y) => { setMonth(m); setYear(y); }}
            />
          </div>
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

        {summary?.overBudget && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Alert variant="destructive">
              <AlertTitle>Over Budget!</AlertTitle>
              <AlertDescription>
                You've exceeded your monthly income. Review your expenses.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Tab Switcher */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
          {(["overview", "analytics"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setPersonalTab(tab)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                personalTab === tab
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "overview" ? "Overview" : "Analytics"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {personalTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard title="Monthly Income" value={summary?.monthlyIncome ?? 0} icon={DollarSign} delay={0} />
                <SummaryCard title="Total Spent" value={summary?.totalSpent ?? 0} icon={CreditCard} trend="up" delay={0.1} />
                <SummaryCard title="Remaining" value={summary?.remaining ?? 0} icon={Landmark} trend="down" delay={0.2} />
              </div>

              {summary && (
                <TrendIndicator
                  currentSpent={summary.totalSpent}
                  month={month}
                  year={year}
                />
              )}

              <CategoryInsightChips data={summary?.categoryBreakdown ?? []} />

              <BudgetOverview summary={summary} />

              <RecentExpenses expenses={summary?.recentExpenses ?? []} />
            </motion.div>
          )}
          {personalTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              {summary && <SpendingInsights summary={summary} />}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CategoryBreakdown data={summary?.categoryBreakdown ?? []} />
                <SpendingChart data={summary?.categoryBreakdown ?? []} />
              </div>

              {summary && <Achievements summary={summary} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <QuickAddExpense onSuccess={fetchData} />
    </AppLayout>
  );
}
