package com.stayhub.backend.categories;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, String> {
    boolean existsByNameIgnoreCase(String name);
}