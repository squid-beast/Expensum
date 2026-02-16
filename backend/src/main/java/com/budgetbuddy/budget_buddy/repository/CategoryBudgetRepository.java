package com.budgetbuddy.budget_buddy.repository;

import com.budgetbuddy.budget_buddy.entity.CategoryBudget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryBudgetRepository extends JpaRepository<CategoryBudget, Long> {
    List<CategoryBudget> findByUserIdAndMonthAndYear(Long userId, Integer month, Integer year);
}
