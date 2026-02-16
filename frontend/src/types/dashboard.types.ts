export interface CategoryBreakdown {
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface RecentExpense {
  id: number;
  categoryName: string;
  categoryIcon: string;
  amount: number;
  description: string | null;
  expenseDate: string;
  ownerName: string | null;
}

export interface DashboardSummary {
  monthlyIncome: number;
  savingsGoal: number | null;
  totalSpent: number;
  remaining: number;
  daysElapsed: number;
  totalDaysInMonth: number;
  dailyAverage: number;
  projectedSpend: number;
  overBudget: boolean;
  riskAlert: boolean;
  categoryBreakdown: CategoryBreakdown[];
  recentExpenses: RecentExpense[];
}
