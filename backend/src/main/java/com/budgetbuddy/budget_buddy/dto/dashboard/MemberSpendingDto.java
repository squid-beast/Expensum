package com.budgetbuddy.budget_buddy.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data @AllArgsConstructor
public class MemberSpendingDto {
    private Long userId;
    private String fullName;
    private BigDecimal amountSpent;
    private BigDecimal fairShare;
    private BigDecimal difference;
    private double percentage;
}
