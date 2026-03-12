package com.stayhub.backend.favorites;

import com.stayhub.backend.accommodations.Accommodation;
import com.stayhub.backend.accommodations.AccommodationRepository;
import com.stayhub.backend.accommodations.dto.AccommodationCardResponse;
import com.stayhub.backend.accommodations.dto.AccommodationCategoryResponse;
import com.stayhub.backend.favorites.dto.FavoriteStatusResponse;
import com.stayhub.backend.users.User;
import com.stayhub.backend.users.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.stayhub.backend.reviews.ReviewRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final AccommodationRepository accommodationRepository;
    private final ReviewRepository reviewRepository;

    @Transactional
    public FavoriteStatusResponse add(String userEmail, String accommodationId) {
        User user = requireUser(userEmail);
        Accommodation accommodation = requireAccommodation(accommodationId);

        boolean alreadyFavorite = favoriteRepository.existsByUserIdAndAccommodationId(
                user.getId(),
                accommodation.getId()
        );

        if (!alreadyFavorite) {
            Favorite favorite = Favorite.builder()
                    .user(user)
                    .accommodation(accommodation)
                    .build();

            favoriteRepository.save(favorite);
        }

        return new FavoriteStatusResponse(accommodationId, true);
    }

    @Transactional
    public void remove(String userEmail, String accommodationId) {
        User user = requireUser(userEmail);
        requireAccommodation(accommodationId);

        favoriteRepository.deleteByUserIdAndAccommodationId(user.getId(), accommodationId);
    }

    @Transactional(readOnly = true)
    public List<AccommodationCardResponse> listMyFavorites(String userEmail) {
        User user = requireUser(userEmail);

        return favoriteRepository.findByUserIdOrderByIdDesc(user.getId()).stream()
                .map(Favorite::getAccommodation)
                .map(this::toCard)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<String> listMyFavoriteIds(String userEmail) {
        User user = requireUser(userEmail);

        return favoriteRepository.findByUserId(user.getId()).stream()
                .map(favorite -> favorite.getAccommodation().getId())
                .distinct()
                .toList();
    }

    private User requireUser(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
    }

    private Accommodation requireAccommodation(String accommodationId) {
        return accommodationRepository.findById(accommodationId)
                .orElseThrow(() -> new EntityNotFoundException("Alojamiento no encontrado"));
    }

    private AccommodationCardResponse toCard(Accommodation a) {
        String firstImage = a.getImages().isEmpty() ? null : a.getImages().get(0).getUrl();

        AccommodationCategoryResponse category = null;
        if (a.getCategory() != null) {
            category = new AccommodationCategoryResponse(
                    a.getCategory().getId(),
                    a.getCategory().getName()
            );
        }

        Double averageRating = reviewRepository.findAverageScoreByAccommodationId(a.getId());
        long reviewsCount = reviewRepository.countByAccommodationId(a.getId());

        return new AccommodationCardResponse(
                a.getId(),
                a.getName(),
                a.getCity(),
                a.getCountry(),
                a.getPricePerNight(),
                firstImage,
                category,
                averageRating,
                reviewsCount
        );
    }
}