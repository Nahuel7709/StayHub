package com.stayhub.backend.favorites.dto;

public record FavoriteStatusResponse(
        String accommodationId,
        boolean favorite
) {
}