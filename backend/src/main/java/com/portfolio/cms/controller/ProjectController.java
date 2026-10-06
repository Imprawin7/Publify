package com.portfolio.cms.controller;

import com.portfolio.cms.exception.ResourceNotFoundException;
import com.portfolio.cms.model.Project;
import com.portfolio.cms.repository.ProjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectRepository projectRepository;

    public ProjectController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @GetMapping
    public List<Project> getAll(@RequestParam(required = false) Boolean featured) {
        if (Boolean.TRUE.equals(featured)) {
            return projectRepository.findByFeaturedTrueOrderBySortOrderAsc();
        }
        return projectRepository.findAllByOrderBySortOrderAsc();
    }

    @GetMapping("/{id}")
    public Project getOne(@PathVariable Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + id));
    }

    @PostMapping
    public ResponseEntity<Project> create(@RequestBody Project project) {
        return ResponseEntity.ok(projectRepository.save(project));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> update(@PathVariable Long id, @RequestBody Project incoming) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + id));
        project.setTitle(incoming.getTitle());
        project.setDescription(incoming.getDescription());
        project.setTechStack(incoming.getTechStack());
        project.setRepoUrl(incoming.getRepoUrl());
        project.setLiveUrl(incoming.getLiveUrl());
        project.setImageUrl(incoming.getImageUrl());
        project.setFeatured(incoming.getFeatured());
        project.setSortOrder(incoming.getSortOrder());
        return ResponseEntity.ok(projectRepository.save(project));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projectRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
