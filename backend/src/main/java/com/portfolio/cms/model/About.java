package com.portfolio.cms.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "about")
@Data
public class About {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String headline;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String location;
    private String email;
    private String resumeUrl;
    private String avatarMediaUrl;
}
