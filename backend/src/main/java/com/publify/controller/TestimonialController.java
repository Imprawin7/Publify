package com.publify.controller;

import com.publify.exception.ResourceNotFoundException;
import com.publify.model.Testimonial;
import com.publify.repository.TestimonialRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/testimonials")
public class TestimonialController {

    private final TestimonialRepository testimonialRepository;

    public TestimonialController(TestimonialRepository testimonialRepository) {
        this.testimonialRepository = testimonialRepository;
    }

    @GetMapping
    public List<Testimonial> getAll() {
        return testimonialRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Testimonial> create(@RequestBody Testimonial testimonial) {
        return ResponseEntity.ok(testimonialRepository.save(testimonial));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Testimonial> update(@PathVariable Long id, @RequestBody Testimonial incoming) {
        Testimonial testimonial = testimonialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial not found: " + id));
        testimonial.setAuthorName(incoming.getAuthorName());
        testimonial.setAuthorRole(incoming.getAuthorRole());
        testimonial.setMessage(incoming.getMessage());
        testimonial.setAvatarUrl(incoming.getAvatarUrl());
        return ResponseEntity.ok(testimonialRepository.save(testimonial));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        testimonialRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
