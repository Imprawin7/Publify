package com.publify.controller;

import com.publify.exception.ResourceNotFoundException;
import com.publify.model.Blog;
import com.publify.model.Workspace;
import com.publify.repository.BlogRepository;
import com.publify.service.WorkspaceContextService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/workspace/blogs")
public class WorkspaceBlogController {

    private final BlogRepository blogRepository;
    private final WorkspaceContextService workspaceContextService;

    public WorkspaceBlogController(
            BlogRepository blogRepository,
            WorkspaceContextService workspaceContextService
    ) {
        this.blogRepository = blogRepository;
        this.workspaceContextService = workspaceContextService;
    }

    @GetMapping
    public List<Blog> getAll(
            @RequestParam(required = false) String status,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        if (status != null && !status.isBlank()) {
            return blogRepository
                    .findByWorkspaceAndStatusOrderByPublishedAtDesc(
                            workspace,
                            status
                    );
        }

        return blogRepository.findByWorkspaceOrderByCreatedAtDesc(
                workspace
        );
    }

    @GetMapping("/{id}")
    public Blog getOne(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        Blog blog = blogRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Blog not found: " + id
                        )
                );

        if (blog.getWorkspace() == null
                || !blog.getWorkspace().getId().equals(workspace.getId())) {
            throw new ResourceNotFoundException(
                    "Blog not found: " + id
            );
        }

        return blog;
    }

    @PostMapping
    public ResponseEntity<Blog> create(
            @RequestBody Blog blog,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        blog.setId(null);
        blog.setWorkspace(workspace);

        if ("PUBLISHED".equals(blog.getStatus())
                && blog.getPublishedAt() == null) {
            blog.setPublishedAt(Instant.now());
        }

        return ResponseEntity.ok(
                blogRepository.save(blog)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Blog> update(
            @PathVariable Long id,
            @RequestBody Blog incoming,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        Blog blog = blogRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Blog not found: " + id
                        )
                );

        if (blog.getWorkspace() == null
                || !blog.getWorkspace().getId().equals(workspace.getId())) {
            throw new ResourceNotFoundException(
                    "Blog not found: " + id
            );
        }

        boolean justPublished =
                "PUBLISHED".equals(incoming.getStatus())
                        && !"PUBLISHED".equals(blog.getStatus());

        blog.setTitle(incoming.getTitle());
        blog.setSlug(incoming.getSlug());
        blog.setContent(incoming.getContent());
        blog.setCoverImageUrl(incoming.getCoverImageUrl());
        blog.setStatus(incoming.getStatus());

        if (justPublished) {
            blog.setPublishedAt(Instant.now());
        }

        return ResponseEntity.ok(
                blogRepository.save(blog)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        Blog blog = blogRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Blog not found: " + id
                        )
                );

        if (blog.getWorkspace() == null
                || !blog.getWorkspace().getId().equals(workspace.getId())) {
            throw new ResourceNotFoundException(
                    "Blog not found: " + id
            );
        }

        blogRepository.delete(blog);

        return ResponseEntity.noContent().build();
    }
}
