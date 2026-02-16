package com.budgetbuddy.budget_buddy.dto.household;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @AllArgsConstructor @Builder
public class InvitationResponse {
    private Long id;
    private String token;
    private String householdName;
    private Long householdId;
    private String inviterName;
    private String inviteeEmail;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
}
