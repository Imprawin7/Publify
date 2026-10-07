package com.publify.controller;

import com.publify.model.About;
import com.publify.model.Workspace;
import com.publify.repository.AboutRepository;
import com.publify.service.WorkspaceContextService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/workspace/about")
public class WorkspaceAboutController {

    private final AboutRepository aboutRepository;
    private final WorkspaceContextService workspaceContextService;

    public WorkspaceAboutController(
            AboutRepository aboutRepository,
            WorkspaceContextService workspaceContextService
    ) {
        this.aboutRepository = aboutRepository;
        this.workspaceContextService = workspaceContextService;
    }

    @GetMapping
    public ResponseEntity<About> get(Authentication authentication) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        return ResponseEntity.ok(
                aboutRepository
                        .findFirstByWorkspaceOrderByIdAsc(workspace)
                        .orElseGet(About::new)
        );
    }

    @PutMapping
    public ResponseEntity<About> update(
            @RequestBody About incoming,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        About about = aboutRepository
                .findFirstByWorkspaceOrderByIdAsc(workspace)
                .orElseGet(About::new);

        about.setWorkspace(workspace);
        about.setHeadline(incoming.getHeadline());
        about.setBio(incoming.getBio());
        about.setLocation(incoming.getLocation());
        about.setEmail(incoming.getEmail());
        about.setResumeUrl(incoming.getResumeUrl());
        about.setAvatarMediaUrl(incoming.getAvatarMediaUrl());

        return ResponseEntity.ok(
                aboutRepository.save(about)
        );
    }
}
