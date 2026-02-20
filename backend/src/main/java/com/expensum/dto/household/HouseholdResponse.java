package com.expensum.dto.household;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @AllArgsConstructor @Builder
public class HouseholdResponse {
    private Long id;
    private String name;
    private String inviteCode;
    private Long createdById;
    private String createdByName;
    private int memberCount;
    private LocalDateTime createdAt;
}
