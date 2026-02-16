package com.budgetbuddy.budget_buddy.controller;

import com.budgetbuddy.budget_buddy.dto.expense.ExpenseRequest;
import com.budgetbuddy.budget_buddy.dto.expense.ExpenseResponse;
import com.budgetbuddy.budget_buddy.security.UserPrincipal;
import com.budgetbuddy.budget_buddy.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseResponse> create(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(expenseService.createExpense(principal.getId(), request));
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getAll(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Long householdId,
            @RequestParam(required = false, defaultValue = "personal") String type) {
        return ResponseEntity.ok(
                expenseService.getExpenses(principal.getId(), month, year, householdId, type));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> update(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.updateExpense(principal.getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        expenseService.deleteExpense(principal.getId(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/recurring")
    public ResponseEntity<List<ExpenseResponse>> getRecurringTemplates(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(expenseService.getRecurringTemplates(principal.getId()));
    }
}
