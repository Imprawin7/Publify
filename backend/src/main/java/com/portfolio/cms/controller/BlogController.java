package com.portfolio.cms.controller;

import com.portfolio.cms.exception.ResourceNotFoundException;
import com.portfolio.cms.model.Blog;
import com.portfolio.cms.repository.BlogRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/blogs")
public class BlogController {

    private final BlogRepository blogRepository;

    public BlogController(BlogRepository blogRepository) {
        this.blogRepository = blogRepository;
    }

    @GetMapping
    public List<Blog> getAll(@RequestParam(required = false) String status, Authentication auth) {
        if (isAnonymous(auth)) {
            return blogRepository.findByStatusOrderByPublishedAtDesc("PUBLISHED");
        }
        if (status != null) {
            return blogRepository.findByStatusOrderByPublishedAtDesc(status);
        }
        return blogRepository.findAll();
    }

    @GetMapping("/{slug}")
    public Blog getBySlug(@PathVariable String slug, Authentication auth) {
        Blog blog = blogRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found: " + slug));
        if (isAnonymous(auth) && !"PUBLISHED".equals(blog.getStatus())) {
            throw new ResourceNotFoundException("Blog not found: " + slug);
        }
        return blog;
    }

    // Drafts must never leak to the public site: only a logged-in admin sees them.
    private boolean isAnonymous(Authentication auth) {
        return auth == null || auth instanceof AnonymousAuthenticationToken;
    }

    @PostMapping
    public ResponseEntity<Blog> create(@RequestBody Blog blog) {
        if ("PUBLISHED".equals(blog.getStatus()) && blog.getPublishedAt() == null) {
            blog.setPublishedAt(Instant.now());
        }
        return ResponseEntity.ok(blogRepository.save(blog));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Blog> update(@PathVariable Long id, @RequestBody Blog incoming) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found: " + id));
        boolean justPublished = "PUBLISHED".equals(incoming.getStatus()) && !"PUBLISHED".equals(blog.getStatus());

        blog.setTitle(incoming.getTitle());
        blog.setSlug(incoming.getSlug());
        blog.setContent(incoming.getContent());
        blog.setCoverImageUrl(incoming.getCoverImageUrl());
        blog.setStatus(incoming.getStatus());
        if (justPublished) {
            blog.setPublishedAt(Instant.now());
        }
        return ResponseEntity.ok(blogRepository.save(blog));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        blogRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
