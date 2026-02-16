import api from "./api";
import type { DashboardSummary } from "@/types/dashboard.types";

export const dashboardService = {
  getSummary: async (month?: number, year?: number): Promise<DashboardSummary> => {
    const params = new URLSearchParams();
    if (month) params.set("month", String(month));
    if (year) params.set("year", String(year));
    const res = await api.get<DashboardSummary>(`/dashboard/summary?${params}`);
    return res.data;
  },

  exportCsv: async (
    month: number,
    year: number,
    householdId?: number,
    type?: string
  ): Promise<void> => {
    const params = new URLSearchParams();
    params.set("month", String(month));
    params.set("year", String(year));
    if (householdId) params.set("householdId", String(householdId));
    if (type) params.set("type", type);
    const res = await api.get(`/dashboard/export?${params}`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `budget-buddy-${year}-${String(month).padStart(2, "0")}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
