package com.publify.repository;

import com.publify.model.ServiceItem;
import com.publify.model.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceItemRepository extends JpaRepository<ServiceItem, Long> {

    List<ServiceItem> findAllByOrderBySortOrderAsc();

    List<ServiceItem> findByWorkspaceOrderBySortOrderAsc(Workspace workspace);
}