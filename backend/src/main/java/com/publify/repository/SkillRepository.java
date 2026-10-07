package com.publify.repository;

import com.publify.model.Skill;
import com.publify.model.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    List<Skill> findAllByOrderBySortOrderAsc();

    List<Skill> findByWorkspaceOrderBySortOrderAsc(Workspace workspace);
}
