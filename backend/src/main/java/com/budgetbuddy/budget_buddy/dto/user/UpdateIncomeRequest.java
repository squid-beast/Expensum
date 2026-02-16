package com.budgetbuddy.budget_buddy.dto.user;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateIncomeRequest {
    @NotNull(message = "Monthly income is required")
    @DecimalMin(value = "0.0", message = "Monthly income must be non-negative")
    @DecimalMax(value = "99999999.99", message = "Monthly income is too large")
    private BigDecimal monthlyIncome;

    @DecimalMin(value = "0.0", message = "Savings goal must be non-negative")
    @DecimalMax(value = "99999999.99", message = "Savings goal is too large")
    private BigDecimal savingsGoal;
}
