package com.publify.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "testimonials")
@Data
public class Testimonial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String authorName;

    private String authorRole;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    private String avatarUrl;
}
