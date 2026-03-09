package com.stayhub.backend.features;

import com.stayhub.backend.accommodations.Accommodation;
import jakarta.persistence.*;
import lombok.*;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(
        name = "features",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_features_name", columnNames = "name")
        }
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Feature {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(nullable = false, length = 50)
    private String icon;

    @ManyToMany(mappedBy = "features")
    @Builder.Default
    private Set<Accommodation> accommodations = new LinkedHashSet<>();
}