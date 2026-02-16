package com.budgetbuddy.budget_buddy.dto.auth;

import com.budgetbuddy.budget_buddy.dto.user.UserProfileResponse;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserProfileResponse user;
}
