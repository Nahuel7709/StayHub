package com.stayhub.backend.accommodations;

import com.stayhub.backend.accommodations.dto.AccommodationAdminRowResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AccommodationRepository extends JpaRepository<Accommodation, String> {

    Optional<Accommodation> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    Page<Accommodation> findByCategoryId(String categoryId, Pageable pageable);

    List<Accommodation> findAllByCategoryId(String categoryId);

    List<Accommodation> findAllByFeaturesId(String featureId);

    @Query(value = "select id from accommodations order by rand() limit :limit", nativeQuery = true)
    List<String> findRandomIds(@Param("limit") int limit);

    @Query("select new com.stayhub.backend.accommodations.dto.AccommodationAdminRowResponse(a.id, a.name) " +
            "from Accommodation a order by a.name asc")
    List<AccommodationAdminRowResponse> findAdminRows();

    @Query("""
            select a
            from Accommodation a
            left join a.category c
            where (:categoryId is null or c.id = :categoryId)
              and (
                    :query is null
                    or lower(a.name) like lower(concat('%', :query, '%'))
                    or lower(a.city) like lower(concat('%', :query, '%'))
                    or lower(a.country) like lower(concat('%', :query, '%'))
              )
            order by a.name asc
            """)
    List<Accommodation> search(
            @Param("categoryId") String categoryId,
            @Param("query") String query,
            Sort sort
    );
}