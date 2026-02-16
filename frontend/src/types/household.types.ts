import type { CategoryBreakdown, RecentExpense } from "./dashboard.types";

export interface Household {
  id: number;
  name: string;
  inviteCode: string;
  createdById: number;
  createdByName: string;
  memberCount: number;
  createdAt: string;
}

export interface HouseholdMember {
  userId: number;
  fullName: string;
  email: string;
  role: "OWNER" | "MEMBER";
  joinedAt: string;
}

export interface HouseholdDetail extends Household {
  members: HouseholdMember[];
}

export interface Invitation {
  id: number;
  token: string;
  householdName: string;
  householdId: number;
  inviterName: string;
  inviteeEmail: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  createdAt: string;
  expiresAt: string;
}

export interface MemberSpending {
  userId: number;
  fullName: string;
  amountSpent: number;
  fairShare: number;
  difference: number;
  percentage: number;
}

export interface HouseholdDashboardSummary {
  householdName: string;
  memberCount: number;
  totalHouseholdSpent: number;
  fairSharePerMember: number;
  daysElapsed: number;
  totalDaysInMonth: number;
  dailyAverage: number;
  projectedSpend: number;
  memberBreakdown: MemberSpending[];
  categoryBreakdown: CategoryBreakdown[];
  recentExpenses: RecentExpense[];
}

export interface CreateHouseholdRequest {
  name: string;
}

export interface InviteRequest {
  email: string;
}

export interface HouseholdNote {
  id: number;
  content: string;
  authorName: string;
  createdAt: string;
}
