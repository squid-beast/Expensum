package com.expensum.controller;

import com.expensum.dto.expense.ExpenseCommentRequest;
import com.expensum.dto.expense.ExpenseCommentResponse;
import com.expensum.security.UserPrincipal;
import com.expensum.service.ExpenseCommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses/{expenseId}/comments")
@RequiredArgsConstructor
public class ExpenseCommentController {

    private final ExpenseCommentService commentService;

    @PostMapping
    public ResponseEntity<ExpenseCommentResponse> addComment(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long expenseId,
            @Valid @RequestBody ExpenseCommentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(commentService.addComment(principal.getId(), expenseId, request));
    }

    @GetMapping
    public ResponseEntity<List<ExpenseCommentResponse>> getComments(
            @PathVariable Long expenseId) {
        return ResponseEntity.ok(commentService.getComments(expenseId));
    }
}
