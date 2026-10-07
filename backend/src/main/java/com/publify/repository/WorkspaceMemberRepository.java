package com.publify.repository;

import com.publify.model.User;
import com.publify.model.Workspace;
import com.publify.model.WorkspaceMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMember, Long> {

    Optional<WorkspaceMember> findByWorkspaceAndUser(
            Workspace workspace,
            User user
    );

    List<WorkspaceMember> findByUser(User user);

    List<WorkspaceMember> findByWorkspace(Workspace workspace);

    boolean existsByWorkspaceAndUser(
            Workspace workspace,
            User user
    );
}
