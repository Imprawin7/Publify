package com.publify.controller;

import com.publify.exception.ResourceNotFoundException;
import com.publify.model.Skill;
import com.publify.model.Workspace;
import com.publify.repository.SkillRepository;
import com.publify.service.WorkspaceContextService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workspace/skills")
public class WorkspaceSkillController {

    private final SkillRepository skillRepository;
    private final WorkspaceContextService workspaceContextService;

    public WorkspaceSkillController(
            SkillRepository skillRepository,
            WorkspaceContextService workspaceContextService
    ) {
        this.skillRepository = skillRepository;
        this.workspaceContextService = workspaceContextService;
    }

    @GetMapping
    public List<Skill> getAll(Authentication authentication) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        return skillRepository.findByWorkspaceOrderBySortOrderAsc(
                workspace
        );
    }

    @GetMapping("/{id}")
    public Skill getOne(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        Skill skill = skillRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Skill not found: " + id
                        )
                );

        if (skill.getWorkspace() == null
                || !skill.getWorkspace().getId().equals(workspace.getId())) {
            throw new ResourceNotFoundException(
                    "Skill not found: " + id
            );
        }

        return skill;
    }

    @PostMapping
    public ResponseEntity<Skill> create(
            @RequestBody Skill skill,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        skill.setId(null);
        skill.setWorkspace(workspace);

        return ResponseEntity.ok(
                skillRepository.save(skill)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Skill> update(
            @PathVariable Long id,
            @RequestBody Skill incoming,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        Skill skill = skillRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Skill not found: " + id
                        )
                );

        if (skill.getWorkspace() == null
                || !skill.getWorkspace().getId().equals(workspace.getId())) {
            throw new ResourceNotFoundException(
                    "Skill not found: " + id
            );
        }

        skill.setName(incoming.getName());
        skill.setCategory(incoming.getCategory());
        skill.setProficiency(incoming.getProficiency());
        skill.setIcon(incoming.getIcon());
        skill.setSortOrder(incoming.getSortOrder());

        return ResponseEntity.ok(
                skillRepository.save(skill)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        Skill skill = skillRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Skill not found: " + id
                        )
                );

        if (skill.getWorkspace() == null
                || !skill.getWorkspace().getId().equals(workspace.getId())) {
            throw new ResourceNotFoundException(
                    "Skill not found: " + id
            );
        }

        skillRepository.delete(skill);

        return ResponseEntity.noContent().build();
    }
}
