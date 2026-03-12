package com.stayhub.backend.reservations;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByAccommodationIdAndStatusInOrderByCheckInAsc(
            String accommodationId,
            Collection<ReservationStatus> statuses
    );

    boolean existsByAccommodationIdAndStatusInAndCheckInLessThanAndCheckOutGreaterThan(
            String accommodationId,
            Collection<ReservationStatus> statuses,
            LocalDate endDate,
            LocalDate startDate
    );

    boolean existsByUserIdAndAccommodationIdAndStatusAndCheckOutBefore(
            Long userId,
            String accommodationId,
            ReservationStatus status,
            LocalDate date
    );

    @Query("""
            select distinct r.accommodation.id
            from Reservation r
            where r.status in :statuses
              and r.checkIn < :endDate
              and r.checkOut > :startDate
            """)
    List<String> findOccupiedAccommodationIds(
            @Param("statuses") Collection<ReservationStatus> statuses,
            @Param("endDate") LocalDate endDate,
            @Param("startDate") LocalDate startDate
    );
}