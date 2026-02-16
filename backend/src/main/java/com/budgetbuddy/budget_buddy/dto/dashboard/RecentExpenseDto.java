package com.budgetbuddy.budget_buddy.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class RecentExpenseDto {
    private Long id;
    private String categoryName;
    private String categoryIcon;
    private BigDecimal amount;
    private String description;
    private LocalDate expenseDate;
    private String ownerName;
}
