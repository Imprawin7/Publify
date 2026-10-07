package com.publify.controller;

import com.publify.exception.ResourceNotFoundException;
import com.publify.model.Testimonial;
import com.publify.model.Workspace;
import com.publify.repository.TestimonialRepository;
import com.publify.service.WorkspaceContextService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workspace/testimonials")
public class WorkspaceTestimonialController {

    private final TestimonialRepository testimonialRepository;
    private final WorkspaceContextService workspaceContextService;

    public WorkspaceTestimonialController(
            TestimonialRepository testimonialRepository,
            WorkspaceContextService workspaceContextService
    ) {
        this.testimonialRepository = testimonialRepository;
        this.workspaceContextService = workspaceContextService;
    }

    @GetMapping
    public List<Testimonial> getAll(Authentication authentication) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        return testimonialRepository.findByWorkspaceOrderByIdAsc(
                workspace
        );
    }

    @GetMapping("/{id}")
    public Testimonial getOne(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        Testimonial testimonial = testimonialRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Testimonial not found: " + id
                        )
                );

        if (testimonial.getWorkspace() == null
                || !testimonial.getWorkspace().getId().equals(workspace.getId())) {
            throw new ResourceNotFoundException(
                    "Testimonial not found: " + id
            );
        }

        return testimonial;
    }

    @PostMapping
    public ResponseEntity<Testimonial> create(
            @RequestBody Testimonial testimonial,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        testimonial.setId(null);
        testimonial.setWorkspace(workspace);

        return ResponseEntity.ok(
                testimonialRepository.save(testimonial)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Testimonial> update(
            @PathVariable Long id,
            @RequestBody Testimonial incoming,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        Testimonial testimonial = testimonialRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Testimonial not found: " + id
                        )
                );

        if (testimonial.getWorkspace() == null
                || !testimonial.getWorkspace().getId().equals(workspace.getId())) {
            throw new ResourceNotFoundException(
                    "Testimonial not found: " + id
            );
        }

        testimonial.setAuthorName(incoming.getAuthorName());
        testimonial.setAuthorRole(incoming.getAuthorRole());
        testimonial.setMessage(incoming.getMessage());
        testimonial.setAvatarUrl(incoming.getAvatarUrl());

        return ResponseEntity.ok(
                testimonialRepository.save(testimonial)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        Testimonial testimonial = testimonialRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Testimonial not found: " + id
                        )
                );

        if (testimonial.getWorkspace() == null
                || !testimonial.getWorkspace().getId().equals(workspace.getId())) {
            throw new ResourceNotFoundException(
                    "Testimonial not found: " + id
            );
        }

        testimonialRepository.delete(testimonial);

        return ResponseEntity.noContent().build();
    }
}
