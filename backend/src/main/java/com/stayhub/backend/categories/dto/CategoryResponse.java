package com.stayhub.backend.categories.dto;

public record CategoryResponse(
        String id,
        String name,
        String description,
        String imageUrl
) {}