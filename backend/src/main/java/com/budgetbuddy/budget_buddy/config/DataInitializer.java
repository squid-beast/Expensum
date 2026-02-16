package com.budgetbuddy.budget_buddy.config;

import com.budgetbuddy.budget_buddy.entity.Category;
import com.budgetbuddy.budget_buddy.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            categoryRepository.saveAll(List.of(
                createCategory("DoorDash", "truck"),
                createCategory("Uber Eats", "utensils"),
                createCategory("Groceries", "shopping-cart"),
                createCategory("Fun/Entertainment", "smile"),
                createCategory("Rent", "home"),
                createCategory("Utilities", "zap"),
                createCategory("Subscriptions", "repeat"),
                createCategory("Shopping", "shopping-bag"),
                createCategory("Travel", "plane"),
                createCategory("Other", "more-horizontal")
            ));
        }
    }

    private Category createCategory(String name, String icon) {
        Category c = new Category();
        c.setName(name);
        c.setIcon(icon);
        return c;
    }
}
