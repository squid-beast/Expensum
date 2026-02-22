package com.expensum.dto.household;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateHouseholdRequest {

    @NotBlank(message = "Household name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    @DecimalMin(value = "0.01", message = "Budget must be positive")
    @DecimalMax(value = "99999999.99", message = "Budget is too large")
    private BigDecimal monthlyBudget;
}
