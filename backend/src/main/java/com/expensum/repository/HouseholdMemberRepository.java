package com.expensum.repository;

import com.expensum.entity.HouseholdMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HouseholdMemberRepository extends JpaRepository<HouseholdMember, Long> {
    List<HouseholdMember> findByUserId(Long userId);
    List<HouseholdMember> findByHouseholdId(Long householdId);
    boolean existsByHouseholdIdAndUserId(Long householdId, Long userId);
    Optional<HouseholdMember> findByHouseholdIdAndUserId(Long householdId, Long userId);
    void deleteByHouseholdId(Long householdId);
}
