package com.expensum.service;

import com.expensum.dto.expense.ExpenseCommentRequest;
import com.expensum.dto.expense.ExpenseCommentResponse;
import com.expensum.entity.Expense;
import com.expensum.entity.ExpenseComment;
import com.expensum.entity.User;
import com.expensum.exception.ResourceNotFoundException;
import com.expensum.repository.ExpenseCommentRepository;
import com.expensum.repository.ExpenseRepository;
import com.expensum.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseCommentService {

    private final ExpenseCommentRepository commentRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    @Transactional
    public ExpenseCommentResponse addComment(Long userId, Long expenseId, ExpenseCommentRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));

        ExpenseComment comment = new ExpenseComment();
        comment.setExpense(expense);
        comment.setUser(user);
        comment.setContent(request.getContent());

        return toResponse(commentRepository.save(comment));
    }

    public List<ExpenseCommentResponse> getComments(Long expenseId) {
        return commentRepository.findByExpenseIdOrderByCreatedAtAsc(expenseId)
                .stream().map(this::toResponse).toList();
    }

    private ExpenseCommentResponse toResponse(ExpenseComment c) {
        return new ExpenseCommentResponse(
                c.getId(),
                c.getContent(),
                c.getUser().getFullName(),
                c.getCreatedAt());
    }
}
