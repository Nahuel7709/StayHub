package com.stayhub.backend.reviews;

import com.stayhub.backend.accommodations.Accommodation;
import com.stayhub.backend.accommodations.AccommodationRepository;
import com.stayhub.backend.common.ConflictException;
import com.stayhub.backend.reservations.ReservationRepository;
import com.stayhub.backend.reservations.ReservationStatus;
import com.stayhub.backend.reviews.dto.CreateReviewRequest;
import com.stayhub.backend.reviews.dto.ReviewResponse;
import com.stayhub.backend.users.User;
import com.stayhub.backend.users.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final AccommodationRepository accommodationRepository;
    private final ReservationRepository reservationRepository;

    @Transactional(readOnly = true)
    public List<ReviewResponse> listByAccommodation(String accommodationId) {
        if (!accommodationRepository.existsById(accommodationId)) {
            throw new EntityNotFoundException("Alojamiento no encontrado");
        }

        return reviewRepository.findByAccommodationIdOrderByCreatedAtDesc(accommodationId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ReviewResponse create(String accommodationId, String userEmail, CreateReviewRequest request) {
        User user = requireUser(userEmail);
        Accommodation accommodation = requireAccommodation(accommodationId);

        if (reviewRepository.existsByUserIdAndAccommodationId(user.getId(), accommodation.getId())) {
            throw new ConflictException("Ya valoraste este alojamiento");
        }

        boolean hasFinishedReservation =
                reservationRepository.existsByUserIdAndAccommodationIdAndStatusAndCheckOutBefore(
                        user.getId(),
                        accommodation.getId(),
                        ReservationStatus.CONFIRMED,
                        LocalDate.now()
                );

        if (!hasFinishedReservation) {
            throw new IllegalArgumentException("Solo podés valorar un alojamiento luego de finalizar una reserva");
        }

        String normalizedComment = normalizeNullable(request.comment());

        Review review = Review.builder()
                .user(user)
                .accommodation(accommodation)
                .score(request.score())
                .comment(normalizedComment)
                .build();

        Review saved = reviewRepository.save(review);
        return toResponse(saved);
    }

    private User requireUser(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
    }

    private Accommodation requireAccommodation(String accommodationId) {
        return accommodationRepository.findById(accommodationId)
                .orElseThrow(() -> new EntityNotFoundException("Alojamiento no encontrado"));
    }

    private ReviewResponse toResponse(Review review) {
        String authorName = review.getUser().getFirstName() + " " + review.getUser().getLastName();

        return new ReviewResponse(
                review.getId(),
                review.getScore(),
                review.getComment(),
                authorName,
                review.getCreatedAt()
        );
    }

    private String normalizeNullable(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isBlank() ? null : trimmed;
    }
}