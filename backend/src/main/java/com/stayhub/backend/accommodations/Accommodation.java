package com.stayhub.backend.accommodations;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
  name = "accommodations",
  uniqueConstraints = {
    @UniqueConstraint(name = "uk_accommodations_name", columnNames = "name")
  }
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Accommodation {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @Column(nullable = false, length = 120)
  private String name;

  @Column(nullable = false, length = 2000)
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private AccommodationType type;

  @Column(nullable = false, length = 80)
  private String city;

  @Column(nullable = false, length = 80)
  private String country;

  @Column(nullable = true, precision = 12, scale = 2)
  private BigDecimal pricePerNight;

  @OneToMany(mappedBy = "accommodation", cascade = CascadeType.ALL, orphanRemoval = true)
  @Builder.Default
  private List<AccommodationImage> images = new ArrayList<>();
}