package com.stayhub.backend.reviews.dto;

import java.time.LocalDateTime;

public record ReviewResponse(
        Long id,
        Integer score,
        String comment,
        String authorName,
        LocalDateTime createdAt
) {
}