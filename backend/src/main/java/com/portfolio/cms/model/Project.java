package com.portfolio.cms.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "projects")
@Data
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String techStack;
    private String repoUrl;
    private String liveUrl;
    private String imageUrl;
    private Boolean featured = false;
    private Integer sortOrder = 0;
}
