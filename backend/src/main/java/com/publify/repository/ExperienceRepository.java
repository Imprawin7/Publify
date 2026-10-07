package com.publify.repository;

import com.publify.model.Experience;
import com.publify.model.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {

    List<Experience> findAllByOrderBySortOrderAsc();

    List<Experience> findByWorkspaceOrderBySortOrderAsc(Workspace workspace);
}
