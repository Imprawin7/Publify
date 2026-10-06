package com.portfolio.cms.repository;

import com.portfolio.cms.model.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BlogRepository extends JpaRepository<Blog, Long> {
    Optional<Blog> findBySlug(String slug);
    List<Blog> findByStatusOrderByPublishedAtDesc(String status);
}
