package com.stayhub.backend.features;

import com.stayhub.backend.accommodations.AccommodationRepository;
import com.stayhub.backend.features.dto.CreateFeatureRequest;
import com.stayhub.backend.features.dto.FeatureResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeatureService {

    private final FeatureRepository repo;
    private final AccommodationRepository accommodationRepository;

    @Transactional
    public FeatureResponse create(CreateFeatureRequest req) {
        if (repo.existsByNameIgnoreCase(req.name())) {
            throw new IllegalArgumentException("Ya existe una característica con ese nombre");
        }

        var feature = Feature.builder()
                .name(req.name().trim())
                .icon(req.icon().trim())
                .build();

        var saved = repo.save(feature);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<FeatureResponse> list() {
        return repo.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Feature getEntityById(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Característica no encontrada"));
    }

    @Transactional
    public void delete(String id) {
        Feature feature = repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Característica no encontrada"));

        var accommodations = accommodationRepository.findAllByFeaturesId(id);
        accommodations.forEach(acc ->
                acc.getFeatures().removeIf(f -> f.getId().equals(id))
        );

        repo.delete(feature);
    }

    @Transactional
    public FeatureResponse update(String id, CreateFeatureRequest req) {
        Feature feature = repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Característica no encontrada"));

        repo.findByNameIgnoreCase(req.name())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new IllegalArgumentException("Ya existe una característica con ese nombre");
                    }
                });

        feature.setName(req.name().trim());
        feature.setIcon(req.icon().trim());

        var saved = repo.save(feature);
        return toResponse(saved);
    }

    private FeatureResponse toResponse(Feature feature) {
        return new FeatureResponse(
                feature.getId(),
                feature.getName(),
                feature.getIcon()
        );
    }
}