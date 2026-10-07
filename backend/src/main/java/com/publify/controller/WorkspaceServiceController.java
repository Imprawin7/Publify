package com.publify.controller;

import com.publify.exception.ResourceNotFoundException;
import com.publify.model.ServiceItem;
import com.publify.model.Workspace;
import com.publify.repository.ServiceItemRepository;
import com.publify.service.WorkspaceContextService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workspace/services")
public class WorkspaceServiceController {

    private final ServiceItemRepository serviceItemRepository;
    private final WorkspaceContextService workspaceContextService;

    public WorkspaceServiceController(
            ServiceItemRepository serviceItemRepository,
            WorkspaceContextService workspaceContextService
    ) {
        this.serviceItemRepository = serviceItemRepository;
        this.workspaceContextService = workspaceContextService;
    }

    @GetMapping
    public List<ServiceItem> getAll(Authentication authentication) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        return serviceItemRepository.findByWorkspaceOrderBySortOrderAsc(
                workspace
        );
    }

    @GetMapping("/{id}")
    public ServiceItem getOne(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        ServiceItem service = serviceItemRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Service not found: " + id
                        )
                );

        if (service.getWorkspace() == null
                || !service.getWorkspace().getId().equals(workspace.getId())) {
            throw new ResourceNotFoundException(
                    "Service not found: " + id
            );
        }

        return service;
    }

    @PostMapping
    public ResponseEntity<ServiceItem> create(
            @RequestBody ServiceItem service,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        service.setId(null);
        service.setWorkspace(workspace);

        return ResponseEntity.ok(
                serviceItemRepository.save(service)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceItem> update(
            @PathVariable Long id,
            @RequestBody ServiceItem incoming,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        ServiceItem service = serviceItemRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Service not found: " + id
                        )
                );

        if (service.getWorkspace() == null
                || !service.getWorkspace().getId().equals(workspace.getId())) {
            throw new ResourceNotFoundException(
                    "Service not found: " + id
            );
        }

        service.setTitle(incoming.getTitle());
        service.setDescription(incoming.getDescription());
        service.setIcon(incoming.getIcon());
        service.setSortOrder(incoming.getSortOrder());

        return ResponseEntity.ok(
                serviceItemRepository.save(service)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        ServiceItem service = serviceItemRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Service not found: " + id
                        )
                );

        if (service.getWorkspace() == null
                || !service.getWorkspace().getId().equals(workspace.getId())) {
            throw new ResourceNotFoundException(
                    "Service not found: " + id
            );
        }

        serviceItemRepository.delete(service);

        return ResponseEntity.noContent().build();
    }
}
