package com.portfolio.cms.controller;

import com.portfolio.cms.exception.ResourceNotFoundException;
import com.portfolio.cms.model.ServiceItem;
import com.portfolio.cms.repository.ServiceItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services")
public class ServiceController {

    private final ServiceItemRepository serviceItemRepository;

    public ServiceController(ServiceItemRepository serviceItemRepository) {
        this.serviceItemRepository = serviceItemRepository;
    }

    @GetMapping
    public List<ServiceItem> getAll() {
        return serviceItemRepository.findAllByOrderBySortOrderAsc();
    }

    @PostMapping
    public ResponseEntity<ServiceItem> create(@RequestBody ServiceItem service) {
        return ResponseEntity.ok(serviceItemRepository.save(service));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceItem> update(@PathVariable Long id, @RequestBody ServiceItem incoming) {
        ServiceItem service = serviceItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found: " + id));
        service.setTitle(incoming.getTitle());
        service.setDescription(incoming.getDescription());
        service.setIcon(incoming.getIcon());
        service.setSortOrder(incoming.getSortOrder());
        return ResponseEntity.ok(serviceItemRepository.save(service));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        serviceItemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
