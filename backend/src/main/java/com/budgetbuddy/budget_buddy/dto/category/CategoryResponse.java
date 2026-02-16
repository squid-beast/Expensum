package com.budgetbuddy.budget_buddy.dto.category;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryResponse {
    private Long id;
    private String name;
    private String icon;
}
