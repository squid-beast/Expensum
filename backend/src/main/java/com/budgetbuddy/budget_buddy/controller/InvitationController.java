package com.budgetbuddy.budget_buddy.controller;

import com.budgetbuddy.budget_buddy.dto.household.InvitationResponse;
import com.budgetbuddy.budget_buddy.security.UserPrincipal;
import com.budgetbuddy.budget_buddy.service.HouseholdService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invitations")
@RequiredArgsConstructor
public class InvitationController {

    private final HouseholdService householdService;

    @GetMapping("/pending")
    public ResponseEntity<List<InvitationResponse>> getPending(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(householdService.getPendingInvitations(principal.getId()));
    }

    @PostMapping("/{token}/accept")
    public ResponseEntity<Void> accept(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String token) {
        householdService.acceptInvitation(principal.getId(), token);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{token}/decline")
    public ResponseEntity<Void> decline(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String token) {
        householdService.declineInvitation(principal.getId(), token);
        return ResponseEntity.ok().build();
    }
}
