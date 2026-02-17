package com.budgetbuddy.budget_buddy.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String email;
    private String fullName;
    private BigDecimal monthlyIncome;
    private BigDecimal savingsGoal;
    private String phoneNumber;
}
