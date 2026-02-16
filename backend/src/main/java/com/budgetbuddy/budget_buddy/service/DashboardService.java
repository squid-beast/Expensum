package com.budgetbuddy.budget_buddy.service;

import com.budgetbuddy.budget_buddy.dto.dashboard.*;
import com.budgetbuddy.budget_buddy.entity.Expense;
import com.budgetbuddy.budget_buddy.entity.Household;
import com.budgetbuddy.budget_buddy.entity.HouseholdMember;
import com.budgetbuddy.budget_buddy.entity.User;
import com.budgetbuddy.budget_buddy.exception.ResourceNotFoundException;
import com.budgetbuddy.budget_buddy.repository.ExpenseRepository;
import com.budgetbuddy.budget_buddy.repository.HouseholdMemberRepository;
import com.budgetbuddy.budget_buddy.repository.HouseholdRepository;
import com.budgetbuddy.budget_buddy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;
    private final HouseholdRepository householdRepository;
    private final HouseholdMemberRepository householdMemberRepository;
    private final HouseholdService householdService;

    public DashboardSummaryResponse getSummary(Long userId, Integer month, Integer year) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        int m = month != null ? month : LocalDate.now().getMonthValue();
        int y = year != null ? year : LocalDate.now().getYear();
        YearMonth ym = YearMonth.of(y, m);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();
        int totalDays = ym.lengthOfMonth();

        LocalDate today = LocalDate.now();
        int daysElapsed = today.isBefore(start) ? 0 :
                today.isAfter(end) ? totalDays :
                        today.getDayOfMonth();

        BigDecimal totalSpent = expenseRepository.sumByUserAndDateRange(userId, start, end);
        BigDecimal income = user.getMonthlyIncome() != null ? user.getMonthlyIncome() : BigDecimal.ZERO;
        BigDecimal remaining = income.subtract(totalSpent);

        BigDecimal dailyAvg = daysElapsed > 0
                ? totalSpent.divide(BigDecimal.valueOf(daysElapsed), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        BigDecimal projected = dailyAvg.multiply(BigDecimal.valueOf(totalDays));
        boolean riskAlert = projected.compareTo(income) > 0 && daysElapsed > 0;
        boolean overBudget = totalSpent.compareTo(income) > 0;

        List<Expense> expenses = expenseRepository
                .findByUserIdAndExpenseDateBetweenOrderByExpenseDateDesc(userId, start, end);

        List<CategoryBreakdownDto> breakdown = buildCategoryBreakdown(expenses, totalSpent);

        List<RecentExpenseDto> recent = expenses.stream()
                .limit(5)
                .map(e -> new RecentExpenseDto(
                        e.getId(),
                        e.getCategory().getName(),
                        e.getCategory().getIcon(),
                        e.getAmount(),
                        e.getDescription(),
                        e.getExpenseDate(),
                        null))
                .toList();

        return DashboardSummaryResponse.builder()
                .monthlyIncome(income)
                .savingsGoal(user.getSavingsGoal())
                .totalSpent(totalSpent)
                .remaining(remaining)
                .daysElapsed(daysElapsed)
                .totalDaysInMonth(totalDays)
                .dailyAverage(dailyAvg)
                .projectedSpend(projected)
                .overBudget(overBudget)
                .riskAlert(riskAlert)
                .categoryBreakdown(breakdown)
                .recentExpenses(recent)
                .build();
    }

    public HouseholdDashboardResponse getHouseholdSummary(Long userId, Long householdId,
                                                           Integer month, Integer year) {
        householdService.verifyMembership(userId, householdId);

        Household household = householdRepository.findById(householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));

        List<HouseholdMember> members = householdMemberRepository.findByHouseholdId(householdId);
        int memberCount = members.size();

        int m = month != null ? month : LocalDate.now().getMonthValue();
        int y = year != null ? year : LocalDate.now().getYear();
        YearMonth ym = YearMonth.of(y, m);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();
        int totalDays = ym.lengthOfMonth();

        LocalDate today = LocalDate.now();
        int daysElapsed = today.isBefore(start) ? 0 :
                today.isAfter(end) ? totalDays :
                        today.getDayOfMonth();

        BigDecimal totalHouseholdSpent = expenseRepository.sumByHouseholdAndDateRange(householdId, start, end);
        BigDecimal fairShare = memberCount > 0
                ? totalHouseholdSpent.divide(BigDecimal.valueOf(memberCount), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        BigDecimal dailyAvg = daysElapsed > 0
                ? totalHouseholdSpent.divide(BigDecimal.valueOf(daysElapsed), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        BigDecimal projected = dailyAvg.multiply(BigDecimal.valueOf(totalDays));

        // Per-member spending
        Map<Long, BigDecimal> perUserSpending = new HashMap<>();
        for (Object[] row : expenseRepository.sumPerUserByHouseholdAndDateRange(householdId, start, end)) {
            Long uid = (Long) row[0];
            BigDecimal amount = (BigDecimal) row[1];
            perUserSpending.put(uid, amount);
        }

        List<MemberSpendingDto> memberBreakdown = members.stream()
                .map(mem -> {
                    BigDecimal spent = perUserSpending.getOrDefault(mem.getUser().getId(), BigDecimal.ZERO);
                    double pct = totalHouseholdSpent.compareTo(BigDecimal.ZERO) > 0
                            ? spent.divide(totalHouseholdSpent, 4, RoundingMode.HALF_UP)
                            .multiply(BigDecimal.valueOf(100)).doubleValue()
                            : 0;
                    return new MemberSpendingDto(
                            mem.getUser().getId(),
                            mem.getUser().getFullName(),
                            spent,
                            fairShare,
                            spent.subtract(fairShare),
                            pct);
                })
                .toList();

        // Category breakdown from shared expenses
        List<Expense> sharedExpenses = expenseRepository
                .findByHouseholdIdAndSharedTrueAndExpenseDateBetweenOrderByExpenseDateDesc(
                        householdId, start, end);

        List<CategoryBreakdownDto> categoryBreakdown = buildCategoryBreakdown(sharedExpenses, totalHouseholdSpent);

        // Recent 5 shared expenses
        List<RecentExpenseDto> recentExpenses = sharedExpenses.stream()
                .limit(5)
                .map(e -> new RecentExpenseDto(
                        e.getId(),
                        e.getCategory().getName(),
                        e.getCategory().getIcon(),
                        e.getAmount(),
                        e.getDescription(),
                        e.getExpenseDate(),
                        e.getUser().getFullName()))
                .toList();

        return HouseholdDashboardResponse.builder()
                .householdName(household.getName())
                .memberCount(memberCount)
                .totalHouseholdSpent(totalHouseholdSpent)
                .fairSharePerMember(fairShare)
                .daysElapsed(daysElapsed)
                .totalDaysInMonth(totalDays)
                .dailyAverage(dailyAvg)
                .projectedSpend(projected)
                .memberBreakdown(memberBreakdown)
                .categoryBreakdown(categoryBreakdown)
                .recentExpenses(recentExpenses)
                .build();
    }

    private List<CategoryBreakdownDto> buildCategoryBreakdown(List<Expense> expenses, BigDecimal totalSpent) {
        Map<Long, List<Expense>> byCategory = expenses.stream()
                .collect(Collectors.groupingBy(e -> e.getCategory().getId()));

        return byCategory.entrySet().stream()
                .map(entry -> {
                    List<Expense> catExpenses = entry.getValue();
                    Expense sample = catExpenses.getFirst();
                    BigDecimal catTotal = catExpenses.stream()
                            .map(Expense::getAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    double pct = totalSpent.compareTo(BigDecimal.ZERO) > 0
                            ? catTotal.divide(totalSpent, 4, RoundingMode.HALF_UP)
                            .multiply(BigDecimal.valueOf(100)).doubleValue()
                            : 0;
                    return new CategoryBreakdownDto(
                            entry.getKey(),
                            sample.getCategory().getName(),
                            sample.getCategory().getIcon(),
                            catTotal, pct, catExpenses.size());
                })
                .sorted((a, b) -> b.getAmount().compareTo(a.getAmount()))
                .toList();
    }
}
