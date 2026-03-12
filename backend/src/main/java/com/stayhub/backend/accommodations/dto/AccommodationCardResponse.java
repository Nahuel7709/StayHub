package com.stayhub.backend.accommodations.dto;

import java.math.BigDecimal;

public record AccommodationCardResponse(
        String id,
        String name,
        String city,
        String country,
        BigDecimal pricePerNight,
        String imageUrl,
        AccommodationCategoryResponse category,
        Double averageRating,
        long reviewsCount
) {
}