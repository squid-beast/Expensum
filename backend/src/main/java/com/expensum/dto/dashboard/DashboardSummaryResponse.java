package com.expensum.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {
    private BigDecimal monthlyIncome;
    private BigDecimal savingsGoal;
    private BigDecimal totalSpent;
    private BigDecimal remaining;
    private int daysElapsed;
    private int totalDaysInMonth;
    private BigDecimal dailyAverage;
    private BigDecimal projectedSpend;
    private boolean overBudget;
    private boolean riskAlert;
    private List<CategoryBreakdownDto> categoryBreakdown;
    private List<RecentExpenseDto> recentExpenses;
}
