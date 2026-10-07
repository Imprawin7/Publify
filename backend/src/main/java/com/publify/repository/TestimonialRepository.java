package com.publify.repository;

import com.publify.model.Testimonial;
import com.publify.model.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestimonialRepository extends JpaRepository<Testimonial, Long> {

    List<Testimonial> findByWorkspaceOrderByIdAsc(Workspace workspace);
}
