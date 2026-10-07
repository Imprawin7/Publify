package com.publify.service;

import com.publify.model.User;
import com.publify.model.Workspace;
import com.publify.model.WorkspaceMember;
import com.publify.repository.WorkspaceMemberRepository;
import com.publify.repository.WorkspaceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;

    public WorkspaceService(
            WorkspaceRepository workspaceRepository,
            WorkspaceMemberRepository workspaceMemberRepository
    ) {
        this.workspaceRepository = workspaceRepository;
        this.workspaceMemberRepository = workspaceMemberRepository;
    }

    @Transactional
    public Workspace createWorkspaceForUser(
            User user,
            String workspaceName
    ) {
        String name = workspaceName.trim();

        if (name.isBlank()) {
            throw new IllegalArgumentException("Workspace name is required");
        }

        String slug = createUniqueSlug(name);

        Workspace workspace = new Workspace();
        workspace.setName(name);
        workspace.setSlug(slug);

        workspace = workspaceRepository.save(workspace);

        WorkspaceMember member = new WorkspaceMember();
        member.setWorkspace(workspace);
        member.setUser(user);
        member.setRole("OWNER");

        workspaceMemberRepository.save(member);

        return workspace;
    }

    private String createUniqueSlug(String name) {
        String baseSlug = name
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");

        if (baseSlug.isBlank()) {
            baseSlug = "workspace";
        }

        String slug = baseSlug;
        int counter = 2;

        while (workspaceRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter;
            counter++;
        }

        return slug;
    }
}
