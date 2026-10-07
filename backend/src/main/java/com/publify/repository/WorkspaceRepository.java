package com.publify.repository;

import com.publify.model.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {

    Optional<Workspace> findBySlug(String slug);

    boolean existsBySlug(String slug);
}
