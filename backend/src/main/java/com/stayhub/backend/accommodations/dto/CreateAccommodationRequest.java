package com.stayhub.backend.accommodations.dto;

import com.stayhub.backend.accommodations.AccommodationType;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

public record CreateAccommodationRequest(
        @NotBlank
        @Size(max = 120)
        String name,

        @NotBlank
        @Size(max = 2000)
        String description,

        @NotNull
        AccommodationType type,

        @NotBlank
        @Size(max = 80)
        String city,

        @NotBlank
        @Size(max = 80)
        String country,

        @DecimalMin(value = "0.0", inclusive = false)
        BigDecimal pricePerNight,

        String categoryId,

        List<String> featureIds,

        @NotEmpty
        List<String> imageUrls,

        @Size(max = 2000)
        String houseRules,

        @Size(max = 2000)
        String healthAndSafety,

        @Size(max = 2000)
        String cancellationPolicy
) {
}