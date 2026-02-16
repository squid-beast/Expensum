package com.budgetbuddy.budget_buddy.dto.household;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateHouseholdRequest {

    @NotBlank(message = "Household name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;
}
