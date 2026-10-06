package com.publify.controller;

import com.publify.dto.ContactRequest;
import com.publify.model.Message;
import com.publify.repository.MessageRepository;
import com.publify.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ContactController {

    private final MessageRepository messageRepository;
    private final EmailService emailService;

    public ContactController(MessageRepository messageRepository, EmailService emailService) {
        this.messageRepository = messageRepository;
        this.emailService = emailService;
    }

    // Public: the frontend contact form posts here.
    @PostMapping("/contact")
    public ResponseEntity<Message> submit(@Valid @RequestBody ContactRequest request) {
        Message message = new Message();
        message.setName(request.getName());
        message.setEmail(request.getEmail());
        message.setMessage(request.getMessage());
        Message saved = messageRepository.save(message);

        emailService.notifyNewContactMessage(request.getName(), request.getEmail(), request.getMessage());

        return ResponseEntity.ok(saved);
    }

    // Admin-only: view submitted messages in the admin panel.
    @GetMapping("/messages")
    public List<Message> getAll() {
        return messageRepository.findAllByOrderByCreatedAtDesc();
    }

    @PutMapping("/messages/{id}/read")
    public ResponseEntity<Message> markRead(@PathVariable Long id) {
        Message message = messageRepository.findById(id).orElseThrow();
        message.setRead(true);
        return ResponseEntity.ok(messageRepository.save(message));
    }
}
