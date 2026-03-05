package com.stayhub.backend.accommodations;

import com.stayhub.backend.accommodations.dto.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import io.swagger.v3.oas.annotations.Parameter;

import java.util.List;

@Validated
@RestController
@RequestMapping("/accommodations")
@RequiredArgsConstructor
public class AccommodationController {

    private final AccommodationService service;

    // (Legacy) Crear con JSON (imageUrls)
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public AccommodationResponse createJson(@Valid @RequestBody CreateAccommodationRequest req) {
        return service.create(req);
    }

    // Crear con multipart (subida de archivos)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public AccommodationResponse createMultipart(
            @Valid @ModelAttribute CreateAccommodationForm form
    ) {
        return service.createWithUploads(form);
    }

    // pagination
    @GetMapping
    public Page<AccommodationCardResponse> list(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(50) int size
    ) {
        return service.list(page, size);
    }

    // random
    @GetMapping("/random")
    public List<AccommodationCardResponse> random(
            @RequestParam(defaultValue = "10") @Min(1) @Max(10) int limit
    ) {
        return service.random(limit);
    }

    // admin list
    @GetMapping("/admin")
    public List<AccommodationAdminRowResponse> admin() {
        return service.adminList();
    }

    @GetMapping("/admin/cards")
    public List<AccommodationCardResponse> adminCards() {
        return service.adminCards();
    }

    // detail
    @GetMapping("/{id}")
    public AccommodationResponse getById(@PathVariable String id) {
        return service.getById(id);
    }

    // delete
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}