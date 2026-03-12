package com.stayhub.backend.accommodations.dto;

import com.stayhub.backend.accommodations.AccommodationType;

import java.math.BigDecimal;
import java.util.List;

public record AccommodationResponse(
        String id,
        String name,
        String description,
        AccommodationType type,
        String city,
        String country,
        BigDecimal pricePerNight,
        AccommodationCategoryResponse category,
        List<AccommodationFeatureResponse> features,
        List<AccommodationImageResponse> images,
        String houseRules,
        String healthAndSafety,
        String cancellationPolicy,
        Double averageRating,
        long reviewsCount
) {
}