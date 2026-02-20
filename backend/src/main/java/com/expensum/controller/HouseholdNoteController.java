package com.expensum.controller;

import com.expensum.dto.household.HouseholdNoteRequest;
import com.expensum.dto.household.HouseholdNoteResponse;
import com.expensum.security.UserPrincipal;
import com.expensum.service.HouseholdNoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/households/{householdId}/notes")
@RequiredArgsConstructor
public class HouseholdNoteController {

    private final HouseholdNoteService noteService;

    @PostMapping
    public ResponseEntity<HouseholdNoteResponse> addNote(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long householdId,
            @Valid @RequestBody HouseholdNoteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(noteService.addNote(principal.getId(), householdId, request));
    }

    @GetMapping
    public ResponseEntity<List<HouseholdNoteResponse>> getNotes(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long householdId) {
        return ResponseEntity.ok(noteService.getNotes(principal.getId(), householdId));
    }
}
