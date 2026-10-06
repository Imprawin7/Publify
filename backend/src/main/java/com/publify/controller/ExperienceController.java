package com.publify.controller;

import com.publify.exception.ResourceNotFoundException;
import com.publify.model.Experience;
import com.publify.repository.ExperienceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/experience")
public class ExperienceController {

    private final ExperienceRepository experienceRepository;

    public ExperienceController(ExperienceRepository experienceRepository) {
        this.experienceRepository = experienceRepository;
    }

    @GetMapping
    public List<Experience> getAll() {
        return experienceRepository.findAllByOrderBySortOrderAsc();
    }

    @PostMapping
    public ResponseEntity<Experience> create(@RequestBody Experience experience) {
        return ResponseEntity.ok(experienceRepository.save(experience));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Experience> update(@PathVariable Long id, @RequestBody Experience incoming) {
        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found: " + id));
        experience.setTitle(incoming.getTitle());
        experience.setOrganization(incoming.getOrganization());
        experience.setStartDate(incoming.getStartDate());
        experience.setEndDate(incoming.getEndDate());
        experience.setDescription(incoming.getDescription());
        experience.setSortOrder(incoming.getSortOrder());
        return ResponseEntity.ok(experienceRepository.save(experience));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        experienceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
