package com.publify.repository;

import com.publify.model.About;
import com.publify.model.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AboutRepository extends JpaRepository<About, Long> {

    Optional<About> findFirstByWorkspaceOrderByIdAsc(Workspace workspace);
}
