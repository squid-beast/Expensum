package com.budgetbuddy.budget_buddy.repository;

import com.budgetbuddy.budget_buddy.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
