package com.expensum.config;

import com.expensum.entity.Category;
import com.expensum.repository.CategoryRepository;
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
        // Categories are seeded by Flyway V2 migration.
        // This block is a no-op safeguard — Flyway runs before this on every startup.
    }

    private Category createCategory(String name, String icon) {
        Category c = new Category();
        c.setName(name);
        c.setIcon(icon);
        return c;
    }
}
