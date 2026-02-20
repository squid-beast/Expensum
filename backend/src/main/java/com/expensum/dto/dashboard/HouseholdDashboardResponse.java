package com.expensum.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class HouseholdDashboardResponse {
    private String householdName;
    private int memberCount;
    private BigDecimal totalHouseholdSpent;
    private BigDecimal fairSharePerMember;
    private int daysElapsed;
    private int totalDaysInMonth;
    private BigDecimal dailyAverage;
    private BigDecimal projectedSpend;
    private List<MemberSpendingDto> memberBreakdown;
    private List<CategoryBreakdownDto> categoryBreakdown;
    private List<RecentExpenseDto> recentExpenses;
}
