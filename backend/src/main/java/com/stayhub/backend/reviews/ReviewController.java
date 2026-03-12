package com.stayhub.backend.reviews;

import com.stayhub.backend.reviews.dto.CreateReviewRequest;
import com.stayhub.backend.reviews.dto.ReviewResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/accommodations/{accommodationId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public List<ReviewResponse> list(@PathVariable String accommodationId) {
        return reviewService.listByAccommodation(accommodationId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewResponse create(
            @PathVariable String accommodationId,
            @Valid @RequestBody CreateReviewRequest request,
            Authentication authentication
    ) {
        return reviewService.create(accommodationId, authentication.getName(), request);
    }
}