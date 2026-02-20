package com.expensum.dto.expense;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ExpenseCommentResponse {
    private Long id;
    private String content;
    private String authorName;
    private LocalDateTime createdAt;
}
