package com.publify.repository;

import com.publify.model.Project;
import com.publify.model.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findAllByOrderBySortOrderAsc();

    List<Project> findByFeaturedTrueOrderBySortOrderAsc();

    List<Project> findByWorkspaceOrderBySortOrderAsc(Workspace workspace);

    List<Project> findByWorkspaceAndFeaturedTrueOrderBySortOrderAsc(
            Workspace workspace
    );
}