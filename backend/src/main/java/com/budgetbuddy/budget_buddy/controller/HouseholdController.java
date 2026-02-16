package com.budgetbuddy.budget_buddy.controller;

import com.budgetbuddy.budget_buddy.dto.household.*;
import com.budgetbuddy.budget_buddy.security.UserPrincipal;
import com.budgetbuddy.budget_buddy.service.HouseholdService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/households")
@RequiredArgsConstructor
public class HouseholdController {

    private final HouseholdService householdService;

    @PostMapping
    public ResponseEntity<HouseholdResponse> create(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateHouseholdRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(householdService.createHousehold(principal.getId(), request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<HouseholdResponse>> getMyHouseholds(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(householdService.getUserHouseholds(principal.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HouseholdDetailResponse> getDetail(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(householdService.getHouseholdDetail(principal.getId(), id));
    }

    @PostMapping("/{id}/invite")
    public ResponseEntity<InvitationResponse> invite(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody InviteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(householdService.inviteMember(principal.getId(), id, request));
    }
}
