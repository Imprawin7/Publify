package com.publify.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Entity
@Table(
    name = "workspaces",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_workspace_slug", columnNames = "slug")
    }
)
@Data
public class Workspace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    private String websiteUrl;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();
}
