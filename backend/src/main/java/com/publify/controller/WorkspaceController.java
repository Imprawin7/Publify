package com.publify.controller;

import com.publify.model.Workspace;
import com.publify.service.WorkspaceContextService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/workspace")
public class WorkspaceController {

    private final WorkspaceContextService workspaceContextService;

    public WorkspaceController(
            WorkspaceContextService workspaceContextService
    ) {
        this.workspaceContextService = workspaceContextService;
    }

    @GetMapping("/me")
    public Map<String, Object> getCurrentWorkspace(
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        String workspaceRole =
                workspaceContextService.getCurrentWorkspaceRole(authentication);

        Map<String, Object> response = new HashMap<>();

        response.put("id", workspace.getId());
        response.put("name", workspace.getName());
        response.put("slug", workspace.getSlug());
        response.put("websiteUrl", workspace.getWebsiteUrl());
        response.put("role", workspaceRole);

        return response;
    }
}