package com.expensum.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "household_members",
    uniqueConstraints = @UniqueConstraint(columnNames = {"household_id", "user_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class HouseholdMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private HouseholdRole role;

    @Column(name = "joined_at", nullable = false)
    private LocalDateTime joinedAt;
}
