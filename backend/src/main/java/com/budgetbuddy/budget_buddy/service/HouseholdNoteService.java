package com.budgetbuddy.budget_buddy.service;

import com.budgetbuddy.budget_buddy.dto.household.HouseholdNoteRequest;
import com.budgetbuddy.budget_buddy.dto.household.HouseholdNoteResponse;
import com.budgetbuddy.budget_buddy.entity.Household;
import com.budgetbuddy.budget_buddy.entity.HouseholdNote;
import com.budgetbuddy.budget_buddy.entity.User;
import com.budgetbuddy.budget_buddy.exception.ResourceNotFoundException;
import com.budgetbuddy.budget_buddy.repository.HouseholdNoteRepository;
import com.budgetbuddy.budget_buddy.repository.HouseholdRepository;
import com.budgetbuddy.budget_buddy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HouseholdNoteService {

    private final HouseholdNoteRepository noteRepository;
    private final HouseholdRepository householdRepository;
    private final UserRepository userRepository;
    private final HouseholdService householdService;

    @Transactional
    public HouseholdNoteResponse addNote(Long userId, Long householdId, HouseholdNoteRequest request) {
        householdService.verifyMembership(userId, householdId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Household household = householdRepository.findById(householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));

        HouseholdNote note = new HouseholdNote();
        note.setHousehold(household);
        note.setUser(user);
        note.setContent(request.getContent());

        return toResponse(noteRepository.save(note));
    }

    public List<HouseholdNoteResponse> getNotes(Long userId, Long householdId) {
        householdService.verifyMembership(userId, householdId);
        return noteRepository.findByHouseholdIdOrderByCreatedAtDesc(householdId)
                .stream().map(this::toResponse).toList();
    }

    private HouseholdNoteResponse toResponse(HouseholdNote n) {
        return new HouseholdNoteResponse(
                n.getId(),
                n.getContent(),
                n.getUser().getFullName(),
                n.getCreatedAt());
    }
}
