package com.stayhub.backend.features.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateFeatureRequest(
        @NotBlank @Size(max = 80) String name,
        @NotBlank @Size(max = 50) String icon
) {}