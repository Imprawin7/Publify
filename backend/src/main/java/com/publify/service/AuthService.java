package com.publify.service;

import com.publify.dto.LoginRequest;
import com.publify.dto.LoginResponse;
import com.publify.dto.RegisterRequest;
import com.publify.model.User;
import com.publify.model.Workspace;
import com.publify.model.WorkspaceMember;
import com.publify.repository.UserRepository;
import com.publify.repository.WorkspaceMemberRepository;
import com.publify.security.JwtUtil;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final WorkspaceService workspaceService;
    private final WorkspaceMemberRepository workspaceMemberRepository;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            WorkspaceService workspaceService,
            WorkspaceMemberRepository workspaceMemberRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.workspaceService = workspaceService;
        this.workspaceMemberRepository = workspaceMemberRepository;
    }

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("An account with this email already exists");
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setEnabled(true);

        user = userRepository.save(user);

        Workspace workspace = workspaceService.createWorkspaceForUser(
                user,
                request.getWorkspaceName()
        );

        WorkspaceMember member = workspaceMemberRepository
                .findByWorkspaceAndUser(workspace, user)
                .orElseThrow(() -> new IllegalStateException(
                        "Workspace membership was not created"
                ));

        String accessToken = jwtUtil.generateAccessToken(
                user.getEmail(),
                user.getRole(),
                workspace.getId(),
                member.getRole()
        );

        String refreshToken = jwtUtil.generateRefreshToken(
                user.getEmail(),
                user.getRole(),
                workspace.getId(),
                member.getRole()
        );

        return new LoginResponse(
                accessToken,
                refreshToken,
                user.getEmail(),
                user.getRole()
        );
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException(
                        "Invalid email or password"
                ));

        if (!user.isEnabled()) {
            throw new BadCredentialsException("Account is disabled");
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash()
        )) {
            throw new BadCredentialsException(
                    "Invalid email or password"
            );
        }

        WorkspaceMember member = workspaceMemberRepository
                .findByUser(user)
                .stream()
                .findFirst()
                .orElse(null);

        String accessToken;
        String refreshToken;

        if (member != null) {
            accessToken = jwtUtil.generateAccessToken(
                    user.getEmail(),
                    user.getRole(),
                    member.getWorkspace().getId(),
                    member.getRole()
            );

            refreshToken = jwtUtil.generateRefreshToken(
                    user.getEmail(),
                    user.getRole(),
                    member.getWorkspace().getId(),
                    member.getRole()
            );
        } else {
            accessToken = jwtUtil.generateAccessToken(
                    user.getEmail(),
                    user.getRole()
            );

            refreshToken = jwtUtil.generateRefreshToken(
                    user.getEmail(),
                    user.getRole()
            );
        }

        return new LoginResponse(
                accessToken,
                refreshToken,
                user.getEmail(),
                user.getRole()
        );
    }

    @Transactional(readOnly = true)
    public LoginResponse refresh(String refreshToken) {
        if (!jwtUtil.isValid(refreshToken)
                || !"refresh".equals(jwtUtil.extractType(refreshToken))) {
            throw new BadCredentialsException(
                    "Invalid or expired refresh token"
            );
        }

        String email = jwtUtil.extractEmail(refreshToken);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException(
                        "User no longer exists"
                ));

        if (!user.isEnabled()) {
            throw new BadCredentialsException("Account is disabled");
        }

        WorkspaceMember member = workspaceMemberRepository
                .findByUser(user)
                .stream()
                .findFirst()
                .orElse(null);

        String newAccessToken;
        String newRefreshToken;

        if (member != null) {
            newAccessToken = jwtUtil.generateAccessToken(
                    user.getEmail(),
                    user.getRole(),
                    member.getWorkspace().getId(),
                    member.getRole()
            );

            newRefreshToken = jwtUtil.generateRefreshToken(
                    user.getEmail(),
                    user.getRole(),
                    member.getWorkspace().getId(),
                    member.getRole()
            );
        } else {
            newAccessToken = jwtUtil.generateAccessToken(
                    user.getEmail(),
                    user.getRole()
            );

            newRefreshToken = jwtUtil.generateRefreshToken(
                    user.getEmail(),
                    user.getRole()
            );
        }

        return new LoginResponse(
                newAccessToken,
                newRefreshToken,
                user.getEmail(),
                user.getRole()
        );
    }
}