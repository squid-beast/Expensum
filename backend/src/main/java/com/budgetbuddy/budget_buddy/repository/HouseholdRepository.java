package com.budgetbuddy.budget_buddy.repository;

import com.budgetbuddy.budget_buddy.entity.Household;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HouseholdRepository extends JpaRepository<Household, Long> {
    Optional<Household> findByInviteCode(String inviteCode);
}
