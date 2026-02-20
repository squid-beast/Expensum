package com.expensum.repository;

import com.expensum.entity.HouseholdNote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HouseholdNoteRepository extends JpaRepository<HouseholdNote, Long> {
    List<HouseholdNote> findByHouseholdIdOrderByCreatedAtDesc(Long householdId);
}
