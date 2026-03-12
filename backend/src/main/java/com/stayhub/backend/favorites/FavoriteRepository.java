package com.stayhub.backend.favorites;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    boolean existsByUserIdAndAccommodationId(Long userId, String accommodationId);

    List<Favorite> findByUserIdOrderByIdDesc(Long userId);

    List<Favorite> findByUserId(Long userId);

    void deleteByUserIdAndAccommodationId(Long userId, String accommodationId);
}