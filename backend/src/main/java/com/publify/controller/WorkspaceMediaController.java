package com.publify.controller;

import com.publify.exception.ResourceNotFoundException;
import com.publify.model.Media;
import com.publify.model.Workspace;
import com.publify.repository.MediaRepository;
import com.publify.service.FileStorageService;
import com.publify.service.WorkspaceContextService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/workspace/media")
public class WorkspaceMediaController {

    private final FileStorageService fileStorageService;
    private final MediaRepository mediaRepository;
    private final WorkspaceContextService workspaceContextService;

    public WorkspaceMediaController(
            FileStorageService fileStorageService,
            MediaRepository mediaRepository,
            WorkspaceContextService workspaceContextService
    ) {
        this.fileStorageService = fileStorageService;
        this.mediaRepository = mediaRepository;
        this.workspaceContextService = workspaceContextService;
    }

    @GetMapping
    public List<Media> getAll(Authentication authentication) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        return mediaRepository.findByWorkspaceOrderByUploadedAtDesc(
                workspace
        );
    }

    @GetMapping("/{id}")
    public Media getOne(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        Media media = mediaRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Media not found: " + id
                        )
                );

        if (media.getWorkspace() == null
                || !media.getWorkspace().getId().equals(workspace.getId())) {
            throw new ResourceNotFoundException(
                    "Media not found: " + id
            );
        }

        return media;
    }

    @PostMapping("/upload")
    public ResponseEntity<Media> upload(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) throws IOException {

        Workspace workspace =
                workspaceContextService.getCurrentWorkspace(authentication);

        String url = fileStorageService.store(file);

        Media media = new Media();
        media.setWorkspace(workspace);
        media.setFilename(file.getOriginalFilename());
        media.setUrl(url);
        media.setMimeType(file.getContentType());
        media.setSizeBytes(file.getSize());

        return ResponseEntity.ok(
                mediaRepository.save(media)
        );
    }

    @GetMapping("/file/{filename}")
    public ResponseEntity<Resource> serve(
            @PathVariable String filename
    ) {
        Resource resource =
                new FileSystemResource(
                        fileStorageService.resolve(filename)
                );

        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(resource);
    }
}
