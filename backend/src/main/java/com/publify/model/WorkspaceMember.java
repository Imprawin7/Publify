package com.publify.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Entity
@Table(
    name = "workspace_members",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_workspace_member",
            columnNames = {"workspace_id", "user_id"}
        )
    }
)
@Data
public class WorkspaceMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String role = "OWNER";

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();
}
