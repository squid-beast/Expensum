package com.expensum.dto.auth;

import com.expensum.dto.user.UserProfileResponse;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserProfileResponse user;
}
