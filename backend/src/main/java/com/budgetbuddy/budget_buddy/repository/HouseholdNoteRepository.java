package com.budgetbuddy.budget_buddy.repository;

import com.budgetbuddy.budget_buddy.entity.HouseholdNote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HouseholdNoteRepository extends JpaRepository<HouseholdNote, Long> {
    List<HouseholdNote> findByHouseholdIdOrderByCreatedAtDesc(Long householdId);
}
