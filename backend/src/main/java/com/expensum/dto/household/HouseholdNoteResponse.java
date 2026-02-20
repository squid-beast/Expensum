package com.expensum.dto.household;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class HouseholdNoteResponse {
    private Long id;
    private String content;
    private String authorName;
    private LocalDateTime createdAt;
}
