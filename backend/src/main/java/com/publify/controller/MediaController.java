package com.publify.controller;

import com.publify.model.Media;
import com.publify.repository.MediaRepository;
import com.publify.service.FileStorageService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaTypeFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
public class MediaController {

    private final FileStorageService fileStorageService;
    private final MediaRepository mediaRepository;

    public MediaController(
            FileStorageService fileStorageService,
            MediaRepository mediaRepository
    ) {
        this.fileStorageService = fileStorageService;
        this.mediaRepository = mediaRepository;
    }

    @PostMapping("/upload/image")
    public ResponseEntity<Media> upload(
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        String url = fileStorageService.store(file);

        Media media = new Media();
        media.setFilename(file.getOriginalFilename());
        media.setUrl(url);
        media.setMimeType(file.getContentType());
        media.setSizeBytes(file.getSize());

        return ResponseEntity.ok(
                mediaRepository.save(media)
        );
    }

    @GetMapping("/media/library")
    public List<Media> library() {
        return mediaRepository.findAll();
    }

    @GetMapping("/media/{filename}")
    public ResponseEntity<Resource> serve(
            @PathVariable String filename
    ) {
        Resource resource = new FileSystemResource(
                fileStorageService.resolve(filename)
        );

        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        MediaType mediaType = MediaTypeFactory
                .getMediaType(resource.getFilename())
                .orElse(MediaType.APPLICATION_OCTET_STREAM);

        return ResponseEntity.ok()
                .contentType(mediaType)
                .body(resource);
    }
}