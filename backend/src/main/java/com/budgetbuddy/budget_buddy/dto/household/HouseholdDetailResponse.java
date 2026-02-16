package com.budgetbuddy.budget_buddy.dto.household;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data @AllArgsConstructor @Builder
public class HouseholdDetailResponse {
    private Long id;
    private String name;
    private String inviteCode;
    private Long createdById;
    private String createdByName;
    private LocalDateTime createdAt;
    private List<MemberDto> members;
}
