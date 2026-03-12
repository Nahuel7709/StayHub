package com.stayhub.backend.reviews;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByUserIdAndAccommodationId(Long userId, String accommodationId);

    List<Review> findByAccommodationIdOrderByCreatedAtDesc(String accommodationId);

    long countByAccommodationId(String accommodationId);

    @Query("select avg(r.score) from Review r where r.accommodation.id = :accommodationId")
    Double findAverageScoreByAccommodationId(@Param("accommodationId") String accommodationId);
}