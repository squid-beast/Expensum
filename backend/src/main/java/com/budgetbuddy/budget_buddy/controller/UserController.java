package com.budgetbuddy.budget_buddy.controller;

import com.budgetbuddy.budget_buddy.dto.user.UpdateIncomeRequest;
import com.budgetbuddy.budget_buddy.dto.user.UserProfileResponse;
import com.budgetbuddy.budget_buddy.security.UserPrincipal;
import com.budgetbuddy.budget_buddy.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(userService.getProfile(principal.getId()));
    }

    @PutMapping("/income")
    public ResponseEntity<UserProfileResponse> updateIncome(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateIncomeRequest request) {
        return ResponseEntity.ok(userService.updateIncome(principal.getId(), request));
    }
}
