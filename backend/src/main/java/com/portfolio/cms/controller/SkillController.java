package com.portfolio.cms.controller;

import com.portfolio.cms.exception.ResourceNotFoundException;
import com.portfolio.cms.model.Skill;
import com.portfolio.cms.repository.SkillRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/skills")
public class SkillController {

    private final SkillRepository skillRepository;

    public SkillController(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @GetMapping
    public List<Skill> getAll() {
        return skillRepository.findAllByOrderBySortOrderAsc();
    }

    @PostMapping
    public ResponseEntity<Skill> create(@RequestBody Skill skill) {
        return ResponseEntity.ok(skillRepository.save(skill));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Skill> update(@PathVariable Long id, @RequestBody Skill incoming) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found: " + id));
        skill.setName(incoming.getName());
        skill.setCategory(incoming.getCategory());
        skill.setProficiency(incoming.getProficiency());
        skill.setIcon(incoming.getIcon());
        skill.setSortOrder(incoming.getSortOrder());
        return ResponseEntity.ok(skillRepository.save(skill));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        skillRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
