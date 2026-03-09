package com.stayhub.backend.features;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FeatureRepository extends JpaRepository<Feature, String> {
    boolean existsByNameIgnoreCase(String name);
    Optional<Feature> findByNameIgnoreCase(String name);
}