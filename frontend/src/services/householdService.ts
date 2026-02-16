import api from "./api";
import type {
  Household,
  HouseholdDetail,
  Invitation,
  CreateHouseholdRequest,
  InviteRequest,
  HouseholdDashboardSummary,
  HouseholdNote,
} from "@/types/household.types";

export const householdService = {
  create: async (data: CreateHouseholdRequest): Promise<Household> => {
    const res = await api.post<Household>("/households", data);
    return res.data;
  },

  getMyHouseholds: async (): Promise<Household[]> => {
    const res = await api.get<Household[]>("/households/my");
    return res.data;
  },

  getDetail: async (id: number): Promise<HouseholdDetail> => {
    const res = await api.get<HouseholdDetail>(`/households/${id}`);
    return res.data;
  },

  invite: async (householdId: number, data: InviteRequest): Promise<Invitation> => {
    const res = await api.post<Invitation>(`/households/${householdId}/invite`, data);
    return res.data;
  },

  getPendingInvitations: async (): Promise<Invitation[]> => {
    const res = await api.get<Invitation[]>("/invitations/pending");
    return res.data;
  },

  acceptInvitation: async (token: string): Promise<void> => {
    await api.post(`/invitations/${token}/accept`);
  },

  declineInvitation: async (token: string): Promise<void> => {
    await api.post(`/invitations/${token}/decline`);
  },

  getHouseholdDashboard: async (
    householdId: number,
    month?: number,
    year?: number
  ): Promise<HouseholdDashboardSummary> => {
    const params = new URLSearchParams();
    params.set("householdId", String(householdId));
    if (month) params.set("month", String(month));
    if (year) params.set("year", String(year));
    const res = await api.get<HouseholdDashboardSummary>(
      `/dashboard/household-summary?${params}`
    );
    return res.data;
  },

  getNotes: async (householdId: number): Promise<HouseholdNote[]> => {
    const res = await api.get<HouseholdNote[]>(`/households/${householdId}/notes`);
    return res.data;
  },

  addNote: async (householdId: number, content: string): Promise<HouseholdNote> => {
    const res = await api.post<HouseholdNote>(`/households/${householdId}/notes`, { content });
    return res.data;
  },
};
