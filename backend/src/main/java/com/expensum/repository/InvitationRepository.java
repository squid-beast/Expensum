package com.expensum.repository;

import com.expensum.entity.Invitation;
import com.expensum.entity.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InvitationRepository extends JpaRepository<Invitation, Long> {
    List<Invitation> findByInviteeEmailAndStatus(String email, InvitationStatus status);
    Optional<Invitation> findByToken(String token);
    boolean existsByHouseholdIdAndInviteeEmailAndStatus(Long householdId, String email, InvitationStatus status);
}
