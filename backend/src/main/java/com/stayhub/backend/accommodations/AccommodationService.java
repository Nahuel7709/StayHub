package com.stayhub.backend.accommodations;

import com.stayhub.backend.accommodations.dto.*;
import com.stayhub.backend.accommodations.dto.CreateAccommodationRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccommodationService {

    private final AccommodationRepository repo;

    @Transactional
    public AccommodationResponse create(CreateAccommodationRequest req) {
        if (repo.existsByNameIgnoreCase(req.name())) {
            throw new IllegalArgumentException("Ya existe un alojamiento con ese nombre");
        }

        var acc = Accommodation.builder()
                .name(req.name().trim())
                .description(req.description().trim())
                .type(req.type())
                .city(req.city().trim())
                .country(req.country().trim())
                .pricePerNight(req.pricePerNight())
                .build();

        req.imageUrls().forEach(url -> acc.getImages().add(
                AccommodationImage.builder()
                        .url(url.trim())
                        .accommodation(acc)
                        .build()
        ));

        try {
            var saved = repo.save(acc);
            return toResponse(saved);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Ya existe un alojamiento con ese nombre");
        }
    }

    @Transactional(readOnly = true)
    public Page<AccommodationCardResponse> list(int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        var result = repo.findAll(pageable);

        var mapped = result.getContent().stream()
                .map(this::toCard)
                .toList();

        return new PageImpl<>(mapped, pageable, result.getTotalElements());
    }

    @Transactional(readOnly = true)
    public AccommodationResponse getById(String id) {
        var acc = repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Alojamiento no encontrado"));
        return toResponse(acc);
    }

    @Transactional
    public void delete(String id) {
        if (!repo.existsById(id)) {
            throw new EntityNotFoundException("Alojamiento no encontrado");
        }
        repo.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<AccommodationCardResponse> random(int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 10)); // sprint pide máx 10
        List<String> ids = repo.findRandomIds(safeLimit);
        if (ids.isEmpty()) return List.of();

        var list = repo.findAllById(ids);
        Map<String, Accommodation> map = list.stream()
                .collect(Collectors.toMap(Accommodation::getId, a -> a));

        List<AccommodationCardResponse> ordered = new ArrayList<>();
        for (String id : ids) {
            var a = map.get(id);
            if (a != null) ordered.add(toCard(a));
        }
        return ordered;
    }

    @Transactional(readOnly = true)
    public List<AccommodationAdminRowResponse> adminList() {
        return repo.findAdminRows();
    }


    private AccommodationResponse toResponse(Accommodation a) {
        var images = a.getImages().stream()
                .map(img -> new AccommodationImageResponse(img.getId(), img.getUrl()))
                .toList();

        return new AccommodationResponse(
                a.getId(),
                a.getName(),
                a.getDescription(),
                a.getType(),
                a.getCity(),
                a.getCountry(),
                a.getPricePerNight(),
                images
        );
    }

    private AccommodationCardResponse toCard(Accommodation a) {
        String firstImage = a.getImages().isEmpty() ? null : a.getImages().get(0).getUrl();

        return new AccommodationCardResponse(
                a.getId(),
                a.getName(),
                a.getCity(),
                a.getCountry(),
                a.getPricePerNight(),
                firstImage
        );
    }
}