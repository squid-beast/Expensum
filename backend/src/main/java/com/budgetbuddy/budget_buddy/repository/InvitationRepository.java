package com.budgetbuddy.budget_buddy.repository;

import com.budgetbuddy.budget_buddy.entity.Invitation;
import com.budgetbuddy.budget_buddy.entity.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InvitationRepository extends JpaRepository<Invitation, Long> {
    List<Invitation> findByInviteeEmailAndStatus(String email, InvitationStatus status);
    Optional<Invitation> findByToken(String token);
    boolean existsByHouseholdIdAndInviteeEmailAndStatus(Long householdId, String email, InvitationStatus status);
}
