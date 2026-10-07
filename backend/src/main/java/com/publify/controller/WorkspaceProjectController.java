package com.publify.controller;

import com.publify.exception.ResourceNotFoundException;
import com.publify.model.Project;
import com.publify.model.Workspace;
import com.publify.repository.ProjectRepository;
import com.publify.service.WorkspaceContextService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workspace/projects")
public class WorkspaceProjectController {

    private final ProjectRepository projectRepository;
    private final WorkspaceContextService workspaceContextService;

    public WorkspaceProjectController(
            ProjectRepository projectRepository,
            WorkspaceContextService workspaceContextService
    ) {
        this.projectRepository = projectRepository;
        this.workspaceContextService = workspaceContextService;
    }

    @GetMapping
    public List<Project> getAll(
            @RequestParam(required = false) Boolean featured,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        if (Boolean.TRUE.equals(featured)) {
            return projectRepository
                    .findByWorkspaceAndFeaturedTrueOrderBySortOrderAsc(
                            workspace
                    );
        }

        return projectRepository.findByWorkspaceOrderBySortOrderAsc(
                workspace
        );
    }

    @GetMapping("/{id}")
    public Project getOne(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found: " + id
                        )
                );

        if (project.getWorkspace() == null
                || !project.getWorkspace().getId().equals(workspace.getId())) {
            throw new ResourceNotFoundException(
                    "Project not found: " + id
            );
        }

        return project;
    }

    @PostMapping
    public ResponseEntity<Project> create(
            @RequestBody Project project,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        project.setId(null);
        project.setWorkspace(workspace);

        return ResponseEntity.ok(
                projectRepository.save(project)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> update(
            @PathVariable Long id,
            @RequestBody Project incoming,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found: " + id
                        )
                );

        if (project.getWorkspace() == null
                || !project.getWorkspace().getId().equals(workspace.getId())) {
            throw new ResourceNotFoundException(
                    "Project not found: " + id
            );
        }

        project.setTitle(incoming.getTitle());
        project.setDescription(incoming.getDescription());
        project.setTechStack(incoming.getTechStack());
        project.setRepoUrl(incoming.getRepoUrl());
        project.setLiveUrl(incoming.getLiveUrl());
        project.setImageUrl(incoming.getImageUrl());
        project.setFeatured(incoming.getFeatured());
        project.setSortOrder(incoming.getSortOrder());

        return ResponseEntity.ok(
                projectRepository.save(project)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found: " + id
                        )
                );

        if (project.getWorkspace() == null
                || !project.getWorkspace().getId().equals(workspace.getId())) {
            throw new ResourceNotFoundException(
                    "Project not found: " + id
            );
        }

        projectRepository.delete(project);

        return ResponseEntity.noContent().build();
    }
}
