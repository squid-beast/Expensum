package com.budgetbuddy.budget_buddy.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "category_budgets",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "category_id", "month", "year"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryBudget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "budget_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal budgetAmount;

    @Column(nullable = false)
    private Integer month;

    @Column(nullable = false)
    private Integer year;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
