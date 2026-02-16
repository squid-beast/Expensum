package com.budgetbuddy.budget_buddy.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "invitations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Invitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inviter_user_id", nullable = false)
    private User inviterUser;

    @Column(name = "invitee_email", nullable = false)
    private String inviteeEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private InvitationStatus status;

    @Column(nullable = false, unique = true, length = 36)
    private String token;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;
}
