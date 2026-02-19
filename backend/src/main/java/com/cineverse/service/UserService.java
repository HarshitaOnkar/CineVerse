package com.cineverse.service;

import com.cineverse.dto.AuthResponse;
import com.cineverse.dto.LoginRequest;
import com.cineverse.dto.SignupRequest;
import com.cineverse.entity.User;
import com.cineverse.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User signup(SignupRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(
                request.getUsername().trim(),
                request.getEmail().trim(),
                request.getPhone() != null ? request.getPhone().trim() : null,
                encodedPassword
        );
        return userRepository.save(user);
    }

    /**
     * Login: find user in DB, match password using BCrypt (encoded stored - never decoded).
     * Returns AuthResponse with success, or message "No account found. Please sign up." / "Invalid password."
     */
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername().trim())
                .orElse(null);
        if (user == null) {
            return new AuthResponse(false, "No account found. Please sign up.");
        }
        boolean matches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!matches) {
            return new AuthResponse(false, "Invalid password.");
        }
        return new AuthResponse(true, "Login successful", user.getUsername());
    }
}
