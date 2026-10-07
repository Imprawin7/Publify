package com.publify.controller;

import com.publify.exception.ResourceNotFoundException;
import com.publify.model.Experience;
import com.publify.model.Workspace;
import com.publify.repository.ExperienceRepository;
import com.publify.service.WorkspaceContextService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workspace/experience")
public class WorkspaceExperienceController {

    private final ExperienceRepository experienceRepository;
    private final WorkspaceContextService workspaceContextService;

    public WorkspaceExperienceController(
            ExperienceRepository experienceRepository,
            WorkspaceContextService workspaceContextService
    ) {
        this.experienceRepository = experienceRepository;
        this.workspaceContextService = workspaceContextService;
    }

    @GetMapping
    public List<Experience> getAll(Authentication authentication) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        return experienceRepository.findByWorkspaceOrderBySortOrderAsc(
                workspace
        );
    }

    @GetMapping("/{id}")
    public Experience getOne(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Experience not found: " + id
                        )
                );

        if (experience.getWorkspace() == null
                || !experience.getWorkspace().getId().equals(workspace.getId())) {
            throw new ResourceNotFoundException(
                    "Experience not found: " + id
            );
        }

        return experience;
    }

    @PostMapping
    public ResponseEntity<Experience> create(
            @RequestBody Experience experience,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        experience.setId(null);
        experience.setWorkspace(workspace);

        return ResponseEntity.ok(
                experienceRepository.save(experience)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Experience> update(
            @PathVariable Long id,
            @RequestBody Experience incoming,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Experience not found: " + id
                        )
                );

        if (experience.getWorkspace() == null
                || !experience.getWorkspace().getId().equals(workspace.getId())) {
            throw new ResourceNotFoundException(
                    "Experience not found: " + id
            );
        }

        experience.setTitle(incoming.getTitle());
        experience.setOrganization(incoming.getOrganization());
        experience.setStartDate(incoming.getStartDate());
        experience.setEndDate(incoming.getEndDate());
        experience.setDescription(incoming.getDescription());
        experience.setSortOrder(incoming.getSortOrder());

        return ResponseEntity.ok(
                experienceRepository.save(experience)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Experience not found: " + id
                        )
                );

        if (experience.getWorkspace() == null
                || !experience.getWorkspace().getId().equals(workspace.getId())) {
            throw new ResourceNotFoundException(
                    "Experience not found: " + id
            );
        }

        experienceRepository.delete(experience);

        return ResponseEntity.noContent().build();
    }
}
