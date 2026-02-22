package com.expensum.repository;

import com.expensum.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserIdAndExpenseDateBetweenOrderByExpenseDateDesc(
            Long userId, LocalDate start, LocalDate end);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e " +
            "WHERE e.user.id = :userId AND e.expenseDate BETWEEN :start AND :end")
    BigDecimal sumByUserAndDateRange(
            @Param("userId") Long userId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end);

    // Household queries
    List<Expense> findByHouseholdIdAndSharedTrueAndExpenseDateBetweenOrderByExpenseDateDesc(
            Long householdId, LocalDate start, LocalDate end);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e " +
           "WHERE e.household.id = :householdId AND e.shared = true " +
           "AND e.expenseDate BETWEEN :start AND :end")
    BigDecimal sumByHouseholdAndDateRange(
            @Param("householdId") Long householdId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end);

    @Query("SELECT e.user.id, COALESCE(SUM(e.amount), 0) FROM Expense e " +
           "WHERE e.household.id = :householdId AND e.shared = true " +
           "AND e.expenseDate BETWEEN :start AND :end GROUP BY e.user.id")
    List<Object[]> sumPerUserByHouseholdAndDateRange(
            @Param("householdId") Long householdId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end);

}
