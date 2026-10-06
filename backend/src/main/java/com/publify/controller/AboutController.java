package com.publify.controller;

import com.publify.model.About;
import com.publify.repository.AboutRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/about")
public class AboutController {

    private final AboutRepository aboutRepository;

    public AboutController(AboutRepository aboutRepository) {
        this.aboutRepository = aboutRepository;
    }

    // "About" is a single content block: return the first row, or an empty shell if none set yet.
    @GetMapping
    public ResponseEntity<About> get() {
        return ResponseEntity.ok(aboutRepository.findAll().stream().findFirst().orElseGet(About::new));
    }

    @PutMapping
    public ResponseEntity<About> update(@RequestBody About incoming) {
        About about = aboutRepository.findAll().stream().findFirst().orElseGet(About::new);
        about.setHeadline(incoming.getHeadline());
        about.setBio(incoming.getBio());
        about.setLocation(incoming.getLocation());
        about.setEmail(incoming.getEmail());
        about.setResumeUrl(incoming.getResumeUrl());
        about.setAvatarMediaUrl(incoming.getAvatarMediaUrl());
        return ResponseEntity.ok(aboutRepository.save(about));
    }
}
