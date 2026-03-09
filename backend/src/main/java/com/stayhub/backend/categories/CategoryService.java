package com.stayhub.backend.categories;

import com.stayhub.backend.accommodations.AccommodationRepository;
import com.stayhub.backend.categories.dto.CategoryResponse;
import com.stayhub.backend.categories.dto.CreateCategoryForm;
import com.stayhub.backend.categories.dto.CreateCategoryRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository repo;
    private final AccommodationRepository accommodationRepository;

    @Transactional
    public CategoryResponse create(CreateCategoryRequest req) {
        if (repo.existsByNameIgnoreCase(req.name())) {
            throw new IllegalArgumentException("Ya existe una categoría con ese nombre");
        }

        var category = Category.builder()
                .name(req.name().trim())
                .description(req.description().trim())
                .imageUrl(req.imageUrl().trim())
                .build();

        var saved = repo.save(category);
        return toResponse(saved);
    }

    @Transactional
    public CategoryResponse createWithUpload(CreateCategoryForm form) {
        if (repo.existsByNameIgnoreCase(form.getName())) {
            throw new IllegalArgumentException("Ya existe una categoría con ese nombre");
        }

        MultipartFile image = form.getImage();
        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Debe incluir una imagen");
        }

        String contentType = image.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Solo se permiten archivos de imagen");
        }

        Path uploadDir = Paths.get("uploads");
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new IllegalArgumentException("No se pudo crear el directorio de uploads");
        }

        String ext = getExtension(image.getOriginalFilename());
        String filename = UUID.randomUUID() + (ext.isEmpty() ? "" : "." + ext);

        Path target = uploadDir.resolve(filename).normalize();
        if (!target.startsWith(uploadDir)) {
            throw new IllegalArgumentException("Nombre de archivo inválido");
        }

        try {
            Files.copy(image.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new IllegalArgumentException("No se pudo guardar la imagen");
        }

        String publicUrl = "/api/uploads/" + filename;

        var category = Category.builder()
                .name(form.getName().trim())
                .description(form.getDescription().trim())
                .imageUrl(publicUrl)
                .build();

        var saved = repo.save(category);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> list() {
        return repo.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Category getEntityById(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada"));
    }

    @Transactional
    public void delete(String id) {
        Category category = repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada"));

        var accommodations = accommodationRepository.findAllByCategoryId(id);
        accommodations.forEach(acc -> acc.setCategory(null));

        repo.delete(category);
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getImageUrl()
        );
    }

    private String getExtension(String name) {
        if (name == null) return "";
        int dot = name.lastIndexOf('.');
        if (dot < 0 || dot == name.length() - 1) return "";
        return name.substring(dot + 1).toLowerCase();
    }
}