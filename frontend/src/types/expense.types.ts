export interface ExpenseRequest {
  categoryId: number;
  amount: number;
  description?: string;
  expenseDate: string;
  householdId?: number;
  shared?: boolean;
}

export interface Expense {
  id: number;
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  amount: number;
  description: string | null;
  expenseDate: string;
  createdAt: string;
  householdId: number | null;
  householdName: string | null;
  shared: boolean;
  ownerName: string | null;
}

export interface ExpenseComment {
  id: number;
  content: string;
  authorName: string;
  createdAt: string;
}
