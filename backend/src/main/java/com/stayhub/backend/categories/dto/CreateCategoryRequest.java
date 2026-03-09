package com.stayhub.backend.categories.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCategoryRequest(
        @NotBlank @Size(max = 80) String name,
        @NotBlank @Size(max = 500) String description,
        @NotBlank @Size(max = 500) String imageUrl
) {}