package com.stayhub.backend.accommodations.dto;

public record SearchSuggestionResponse(
        String id,
        String label,
        String value,
        String type
) {
}