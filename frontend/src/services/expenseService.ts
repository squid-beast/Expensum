import api from "./api";
import type { Expense, ExpenseRequest, ExpenseComment } from "@/types/expense.types";

export const expenseService = {
  getAll: async (
    month?: number,
    year?: number,
    householdId?: number,
    type?: "personal" | "shared" | "all"
  ): Promise<Expense[]> => {
    const params = new URLSearchParams();
    if (month) params.set("month", String(month));
    if (year) params.set("year", String(year));
    if (householdId) params.set("householdId", String(householdId));
    if (type) params.set("type", type);
    const res = await api.get<Expense[]>(`/expenses?${params}`);
    return res.data;
  },

  create: async (data: ExpenseRequest): Promise<Expense> => {
    const res = await api.post<Expense>("/expenses", data);
    return res.data;
  },

  update: async (id: number, data: ExpenseRequest): Promise<Expense> => {
    const res = await api.put<Expense>(`/expenses/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  },

  getRecurringTemplates: async (): Promise<Expense[]> => {
    const res = await api.get<Expense[]>("/expenses/recurring");
    return res.data;
  },

  getComments: async (expenseId: number): Promise<ExpenseComment[]> => {
    const res = await api.get<ExpenseComment[]>(`/expenses/${expenseId}/comments`);
    return res.data;
  },

  addComment: async (expenseId: number, content: string): Promise<ExpenseComment> => {
    const res = await api.post<ExpenseComment>(`/expenses/${expenseId}/comments`, { content });
    return res.data;
  },
};
