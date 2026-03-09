package com.stayhub.backend.accommodations;

import com.stayhub.backend.accommodations.dto.*;
import com.stayhub.backend.categories.Category;
import com.stayhub.backend.categories.CategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccommodationService {

    private final AccommodationRepository repo;
    private final CategoryRepository categoryRepository;

    @Transactional
    public AccommodationResponse create(CreateAccommodationRequest req) {
        if (repo.existsByNameIgnoreCase(req.name())) {
            throw new IllegalArgumentException("Ya existe un alojamiento con ese nombre");
        }

        if (req.imageUrls() == null || req.imageUrls().isEmpty()) {
            throw new IllegalArgumentException("Debe incluir al menos 1 imagen");
        }

        Category category = resolveCategory(req.categoryId());

        var acc = Accommodation.builder()
                .name(req.name().trim())
                .description(req.description().trim())
                .type(req.type())
                .city(req.city().trim())
                .country(req.country().trim())
                .pricePerNight(req.pricePerNight())
                .category(category)
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

    @Transactional
    public AccommodationResponse createWithUploads(CreateAccommodationForm form) {
        if (repo.existsByNameIgnoreCase(form.getName())) {
            throw new IllegalArgumentException("Ya existe un alojamiento con ese nombre");
        }

        var imagesArr = form.getImages();
        if (imagesArr == null || imagesArr.length == 0) {
            throw new IllegalArgumentException("Debe incluir al menos 1 imagen");
        }

        Path uploadDir = Paths.get("uploads");
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new IllegalArgumentException("No se pudo crear el directorio de uploads");
        }

        Category category = resolveCategory(form.getCategoryId());

        var acc = Accommodation.builder()
                .name(form.getName().trim())
                .description(form.getDescription().trim())
                .type(form.getType())
                .city(form.getCity().trim())
                .country(form.getCountry().trim())
                .pricePerNight(form.getPricePerNight())
                .category(category)
                .build();

        for (MultipartFile file : imagesArr) {
            if (file == null || file.isEmpty()) continue;

            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new IllegalArgumentException("Solo se permiten archivos de imagen");
            }

            String ext = getExtension(file.getOriginalFilename());
            String filename = UUID.randomUUID() + (ext.isEmpty() ? "" : "." + ext);

            Path target = uploadDir.resolve(filename).normalize();
            if (!target.startsWith(uploadDir)) {
                throw new IllegalArgumentException("Nombre de archivo inválido");
            }

            try {
                Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException e) {
                throw new IllegalArgumentException("No se pudo guardar una imagen");
            }

            String publicUrl = "/api/uploads/" + filename;
            acc.getImages().add(
                    AccommodationImage.builder()
                            .url(publicUrl)
                            .accommodation(acc)
                            .build()
            );
        }

        try {
            var saved = repo.save(acc);
            return toResponse(saved);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Ya existe un alojamiento con ese nombre");
        }
    }

    @Transactional(readOnly = true)
    public Page<AccommodationCardResponse> list(int page, int size, String categoryId) {
        var pageable = PageRequest.of(page, size, Sort.by("name").ascending());

        Page<Accommodation> result;
        if (categoryId != null && !categoryId.isBlank()) {
            result = repo.findByCategoryId(categoryId, pageable);
        } else {
            result = repo.findAll(pageable);
        }

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
        int safeLimit = Math.max(1, Math.min(limit, 10));
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

    @Transactional(readOnly = true)
    public List<AccommodationCardResponse> adminCards() {
        var list = repo.findAll(Sort.by("name").ascending());
        return list.stream().map(this::toCard).toList();
    }

    private Category resolveCategory(String categoryId) {
        if (categoryId == null || categoryId.isBlank()) {
            return null;
        }

        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada"));
    }

    private AccommodationResponse toResponse(Accommodation a) {
        var images = a.getImages().stream()
                .map(img -> new AccommodationImageResponse(img.getId(), img.getUrl()))
                .toList();

        AccommodationCategoryResponse category = null;
        if (a.getCategory() != null) {
            category = new AccommodationCategoryResponse(
                    a.getCategory().getId(),
                    a.getCategory().getName()
            );
        }

        return new AccommodationResponse(
                a.getId(),
                a.getName(),
                a.getDescription(),
                a.getType(),
                a.getCity(),
                a.getCountry(),
                a.getPricePerNight(),
                category,
                images
        );
    }

    private AccommodationCardResponse toCard(Accommodation a) {
        String firstImage = a.getImages().isEmpty() ? null : a.getImages().get(0).getUrl();

        AccommodationCategoryResponse category = null;
        if (a.getCategory() != null) {
            category = new AccommodationCategoryResponse(
                    a.getCategory().getId(),
                    a.getCategory().getName()
            );
        }

        return new AccommodationCardResponse(
                a.getId(),
                a.getName(),
                a.getCity(),
                a.getCountry(),
                a.getPricePerNight(),
                firstImage,
                category
        );
    }

    private String getExtension(String name) {
        if (name == null) return "";
        int dot = name.lastIndexOf('.');
        if (dot < 0 || dot == name.length() - 1) return "";
        return name.substring(dot + 1).toLowerCase();
    }
}