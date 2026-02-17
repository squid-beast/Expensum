package com.budgetbuddy.budget_buddy.service;

import com.budgetbuddy.budget_buddy.dto.user.UpdateIncomeRequest;
import com.budgetbuddy.budget_buddy.dto.user.UserProfileResponse;
import com.budgetbuddy.budget_buddy.entity.User;
import com.budgetbuddy.budget_buddy.exception.ResourceNotFoundException;
import com.budgetbuddy.budget_buddy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserProfileResponse getProfile(Long userId) {
        User user = findUser(userId);
        return toResponse(user);
    }

    @Transactional
    public UserProfileResponse updateIncome(Long userId, UpdateIncomeRequest request) {
        User user = findUser(userId);
        user.setMonthlyIncome(request.getMonthlyIncome());
        if (request.getSavingsGoal() != null) {
            user.setSavingsGoal(request.getSavingsGoal());
        }
        return toResponse(userRepository.save(user));
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private UserProfileResponse toResponse(User user) {
        return new UserProfileResponse(
                user.getId(), user.getEmail(), user.getFullName(),
                user.getMonthlyIncome(), user.getSavingsGoal(), user.getPhoneNumber());
    }
}
