package com.budgetbuddy.budget_buddy.controller;

import com.budgetbuddy.budget_buddy.dto.dashboard.DashboardSummaryResponse;
import com.budgetbuddy.budget_buddy.dto.dashboard.HouseholdDashboardResponse;
import com.budgetbuddy.budget_buddy.dto.expense.ExpenseResponse;
import com.budgetbuddy.budget_buddy.security.UserPrincipal;
import com.budgetbuddy.budget_buddy.service.DashboardService;
import com.budgetbuddy.budget_buddy.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final ExpenseService expenseService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(dashboardService.getSummary(principal.getId(), month, year));
    }

    @GetMapping("/household-summary")
    public ResponseEntity<HouseholdDashboardResponse> getHouseholdSummary(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam Long householdId,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(
                dashboardService.getHouseholdSummary(principal.getId(), householdId, month, year));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportCsv(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Long householdId,
            @RequestParam(required = false, defaultValue = "personal") String type) {
        int m = month != null ? month : LocalDate.now().getMonthValue();
        int y = year != null ? year : LocalDate.now().getYear();

        List<ExpenseResponse> expenses = expenseService.getExpenses(
                principal.getId(), m, y, householdId, type);

        StringBuilder csv = new StringBuilder();
        csv.append("Date,Category,Amount,Description,Type,Owner\n");
        for (ExpenseResponse e : expenses) {
            csv.append(String.format("%s,%s,%.2f,\"%s\",%s,%s\n",
                    e.getExpenseDate(),
                    e.getCategoryName(),
                    e.getAmount(),
                    e.getDescription() != null ? e.getDescription().replace("\"", "\"\"") : "",
                    e.isShared() ? "Shared" : "Personal",
                    e.getOwnerName() != null ? e.getOwnerName() : ""));
        }

        String filename = String.format("budget-buddy-%d-%02d.csv", y, m);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv.toString().getBytes());
    }
}
