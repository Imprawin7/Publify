package com.portfolio.cms.service;

import com.portfolio.cms.dto.LoginRequest;
import com.portfolio.cms.dto.LoginResponse;
import com.portfolio.cms.model.User;
import com.portfolio.cms.repository.UserRepository;
import com.portfolio.cms.security.JwtUtil;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getRole());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail(), user.getRole());
        return new LoginResponse(accessToken, refreshToken, user.getEmail(), user.getRole());
    }

    public LoginResponse refresh(String refreshToken) {
        if (!jwtUtil.isValid(refreshToken) || !"refresh".equals(jwtUtil.extractType(refreshToken))) {
            throw new BadCredentialsException("Invalid or expired refresh token");
        }

        String email = jwtUtil.extractEmail(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("User no longer exists"));

        String newAccessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getRole());
        String newRefreshToken = jwtUtil.generateRefreshToken(user.getEmail(), user.getRole());
        return new LoginResponse(newAccessToken, newRefreshToken, user.getEmail(), user.getRole());
    }
}
