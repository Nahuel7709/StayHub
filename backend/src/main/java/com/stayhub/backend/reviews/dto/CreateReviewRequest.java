package com.stayhub.backend.reviews.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateReviewRequest(
        @NotNull(message = "El puntaje es obligatorio")
        @Min(value = 1, message = "El puntaje mínimo es 1")
        @Max(value = 5, message = "El puntaje máximo es 5")
        Integer score,

        @Size(max = 2000, message = "El comentario no puede superar los 2000 caracteres")
        String comment
) {
}