package com.publify.controller;

import com.publify.model.User;
import com.publify.model.Workspace;
import com.publify.model.WorkspaceMember;
import com.publify.repository.WorkspaceMemberRepository;
import com.publify.service.WorkspaceContextService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/workspace/members")
public class WorkspaceMemberController {

    private final WorkspaceContextService workspaceContextService;
    private final WorkspaceMemberRepository workspaceMemberRepository;

    public WorkspaceMemberController(
            WorkspaceContextService workspaceContextService,
            WorkspaceMemberRepository workspaceMemberRepository
    ) {
        this.workspaceContextService = workspaceContextService;
        this.workspaceMemberRepository = workspaceMemberRepository;
    }

    @GetMapping
    public List<Map<String, Object>> getMembers(
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        return workspaceMemberRepository
                .findByWorkspace(workspace)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private Map<String, Object> toResponse(WorkspaceMember member) {
        User user = member.getUser();

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("id", member.getId());
        response.put("userId", user.getId());
        response.put("email", user.getEmail());
        response.put("role", member.getRole());
        response.put("enabled", user.isEnabled());
        response.put("createdAt", member.getCreatedAt());

        return response;
    }
}