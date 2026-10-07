package com.publify.service;

import com.publify.model.User;
import com.publify.model.Workspace;
import com.publify.model.WorkspaceMember;
import com.publify.repository.UserRepository;
import com.publify.repository.WorkspaceMemberRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WorkspaceContextService {

    private final UserRepository userRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;

    public WorkspaceContextService(
            UserRepository userRepository,
            WorkspaceMemberRepository workspaceMemberRepository
    ) {
        this.userRepository = userRepository;
        this.workspaceMemberRepository = workspaceMemberRepository;
    }

    @Transactional(readOnly = true)
    public WorkspaceMember getCurrentMembership(Authentication authentication) {
        if (authentication == null
                || authentication.getName() == null
                || authentication.getName().isBlank()) {
            throw new IllegalStateException("User is not authenticated");
        }

        User user = userRepository.findByEmail(
                authentication.getName().trim().toLowerCase()
        ).orElseThrow(() ->
                new IllegalStateException("Authenticated user no longer exists")
        );

        return workspaceMemberRepository.findByUser(user)
                .stream()
                .findFirst()
                .orElseThrow(() ->
                        new IllegalStateException(
                                "User does not belong to a workspace"
                        )
                );
    }

    public Workspace getCurrentWorkspace(Authentication authentication) {
        return getCurrentMembership(authentication).getWorkspace();
    }

    public String getCurrentWorkspaceRole(Authentication authentication) {
        return getCurrentMembership(authentication).getRole();
    }
}