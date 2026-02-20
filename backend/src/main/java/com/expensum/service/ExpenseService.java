package com.expensum.service;

import com.expensum.dto.expense.ExpenseRequest;
import com.expensum.dto.expense.ExpenseResponse;
import com.expensum.entity.Category;
import com.expensum.entity.Expense;
import com.expensum.entity.Household;
import com.expensum.entity.User;
import com.expensum.exception.BadRequestException;
import com.expensum.exception.ResourceNotFoundException;
import com.expensum.repository.CategoryRepository;
import com.expensum.repository.ExpenseRepository;
import com.expensum.repository.HouseholdRepository;
import com.expensum.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final HouseholdRepository householdRepository;
    private final HouseholdService householdService;

    @Transactional
    public ExpenseResponse createExpense(Long userId, ExpenseRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Expense expense = new Expense();
        expense.setUser(user);
        expense.setCategory(category);
        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());
        expense.setExpenseDate(request.getExpenseDate());

        expense.setRecurring(Boolean.TRUE.equals(request.getRecurring()));

        // Household shared expense support
        if (request.getHouseholdId() != null) {
            Household household = householdRepository.findById(request.getHouseholdId())
                    .orElseThrow(() -> new ResourceNotFoundException("Household not found"));
            householdService.verifyMembership(userId, household.getId());
            expense.setHousehold(household);
            expense.setShared(Boolean.TRUE.equals(request.getShared()));
        }

        return toResponse(expenseRepository.save(expense));
    }

    public List<ExpenseResponse> getExpenses(Long userId, Integer month, Integer year,
                                              Long householdId, String type) {
        YearMonth ym = YearMonth.of(
                year != null ? year : LocalDate.now().getYear(),
                month != null ? month : LocalDate.now().getMonthValue());
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        if (householdId != null) {
            householdService.verifyMembership(userId, householdId);

            if ("all".equalsIgnoreCase(type)) {
                // All shared expenses in household + user's personal
                List<Expense> shared = expenseRepository
                        .findByHouseholdIdAndSharedTrueAndExpenseDateBetweenOrderByExpenseDateDesc(
                                householdId, start, end);
                List<Expense> personal = expenseRepository
                        .findByUserIdAndExpenseDateBetweenOrderByExpenseDateDesc(userId, start, end)
                        .stream().filter(e -> !e.isShared()).toList();

                List<Expense> combined = new java.util.ArrayList<>(shared);
                combined.addAll(personal);
                combined.sort((a, b) -> b.getExpenseDate().compareTo(a.getExpenseDate()));
                return combined.stream().map(this::toResponse).toList();
            } else {
                // Default: shared expenses only
                return expenseRepository
                        .findByHouseholdIdAndSharedTrueAndExpenseDateBetweenOrderByExpenseDateDesc(
                                householdId, start, end)
                        .stream().map(this::toResponse).toList();
            }
        }

        // Personal expenses (existing behavior)
        return expenseRepository.findByUserIdAndExpenseDateBetweenOrderByExpenseDateDesc(userId, start, end)
                .stream()
                .filter(e -> !e.isShared())
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ExpenseResponse updateExpense(Long userId, Long expenseId, ExpenseRequest request) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));

        if (!expense.getUser().getId().equals(userId)) {
            throw new BadRequestException("Expense does not belong to user");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        expense.setCategory(category);
        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());
        expense.setExpenseDate(request.getExpenseDate());

        return toResponse(expenseRepository.save(expense));
    }

    @Transactional
    public void deleteExpense(Long userId, Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));

        if (!expense.getUser().getId().equals(userId)) {
            throw new BadRequestException("Expense does not belong to user");
        }

        expenseRepository.delete(expense);
    }

    public List<ExpenseResponse> getRecurringTemplates(Long userId) {
        return expenseRepository.findByUserIdAndRecurringTrue(userId)
                .stream().map(this::toResponse).toList();
    }

    private ExpenseResponse toResponse(Expense e) {
        return new ExpenseResponse(
                e.getId(),
                e.getCategory().getId(),
                e.getCategory().getName(),
                e.getCategory().getIcon(),
                e.getAmount(),
                e.getDescription(),
                e.getExpenseDate(),
                e.getCreatedAt(),
                e.getHousehold() != null ? e.getHousehold().getId() : null,
                e.getHousehold() != null ? e.getHousehold().getName() : null,
                e.isShared(),
                e.isRecurring(),
                e.getUser().getFullName());
    }
}
