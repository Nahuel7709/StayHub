package com.stayhub.backend.accommodations.dto;

import com.stayhub.backend.accommodations.AccommodationType;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

public record CreateAccommodationRequest(
        @NotBlank @Size(max = 120) String name,
        @NotBlank @Size(max = 2000) String description,
        @NotNull AccommodationType type,
        @NotBlank @Size(max = 80) String city,
        @NotBlank @Size(max = 80) String country,
        BigDecimal pricePerNight,
        String categoryId,
        List<String> featureIds,

        @NotNull @Size(min = 1, message = "Debe incluir al menos 1 imagen")
        List<@NotBlank @Size(max = 500) String> imageUrls
) {}