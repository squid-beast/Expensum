package com.budgetbuddy.budget_buddy.service;

import com.budgetbuddy.budget_buddy.dto.category.CategoryResponse;
import com.budgetbuddy.budget_buddy.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(c -> new CategoryResponse(c.getId(), c.getName(), c.getIcon()))
                .toList();
    }
}
