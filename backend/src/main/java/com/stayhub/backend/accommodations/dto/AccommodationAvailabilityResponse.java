package com.stayhub.backend.accommodations.dto;

import java.time.LocalDate;
import java.util.List;

public record AccommodationAvailabilityResponse(
        String accommodationId,
        boolean available,
        List<BookedDateRangeResponse> bookedRanges
) {
    public record BookedDateRangeResponse(
            LocalDate checkIn,
            LocalDate checkOut
    ) {
    }
}