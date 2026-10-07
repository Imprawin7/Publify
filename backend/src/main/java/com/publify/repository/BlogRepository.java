package com.publify.repository;

import com.publify.model.Blog;
import com.publify.model.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BlogRepository extends JpaRepository<Blog, Long> {

    Optional<Blog> findBySlug(String slug);

    List<Blog> findByStatusOrderByPublishedAtDesc(String status);

    List<Blog> findByWorkspaceOrderByCreatedAtDesc(Workspace workspace);

    List<Blog> findByWorkspaceAndStatusOrderByPublishedAtDesc(
            Workspace workspace,
            String status
    );
}