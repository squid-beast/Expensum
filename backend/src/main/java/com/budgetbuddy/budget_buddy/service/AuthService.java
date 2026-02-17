package com.budgetbuddy.budget_buddy.service;

import com.budgetbuddy.budget_buddy.dto.auth.AuthResponse;
import com.budgetbuddy.budget_buddy.dto.auth.LoginRequest;
import com.budgetbuddy.budget_buddy.dto.auth.SignupRequest;
import com.budgetbuddy.budget_buddy.dto.user.UserProfileResponse;
import com.budgetbuddy.budget_buddy.entity.User;
import com.budgetbuddy.budget_buddy.exception.BadRequestException;
import com.budgetbuddy.budget_buddy.exception.UnauthorizedException;
import com.budgetbuddy.budget_buddy.repository.UserRepository;
import com.budgetbuddy.budget_buddy.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isBlank()) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        User saved = userRepository.save(user);

        String token = tokenProvider.generateTokenForUser(saved.getId());

        return new AuthResponse(token, toProfileResponse(saved));
    }

    public AuthResponse login(LoginRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
            String token = tokenProvider.generateToken(auth);

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

            return new AuthResponse(token, toProfileResponse(user));
        } catch (Exception e) {
            throw new UnauthorizedException("Invalid email or password");
        }
    }

    private UserProfileResponse toProfileResponse(User user) {
        return new UserProfileResponse(
                user.getId(), user.getEmail(), user.getFullName(),
                user.getMonthlyIncome(), user.getSavingsGoal(), user.getPhoneNumber());
    }
}
