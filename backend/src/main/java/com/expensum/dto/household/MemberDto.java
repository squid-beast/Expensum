package com.expensum.dto.household;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data @AllArgsConstructor
public class MemberDto {
    private Long userId;
    private String fullName;
    private String email;
    private String role;
    private LocalDateTime joinedAt;
}
