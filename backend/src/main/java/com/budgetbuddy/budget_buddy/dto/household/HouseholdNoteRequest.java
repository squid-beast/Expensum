package com.budgetbuddy.budget_buddy.dto.household;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class HouseholdNoteRequest {
    @NotBlank(message = "Note content is required")
    @Size(max = 500, message = "Note must not exceed 500 characters")
    private String content;
}
