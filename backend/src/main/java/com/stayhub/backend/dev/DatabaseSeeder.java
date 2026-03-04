package com.stayhub.backend.dev;

import com.stayhub.backend.accommodations.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final AccommodationRepository repo;

    @Override
    public void run(String... args) {
        if (repo.count() > 0) return;

        seedAccommodation(
                "Hotel Palermo Deluxe",
                "Alojamiento premium en Palermo con desayuno incluido.",
                AccommodationType.HOTEL,
                "Buenos Aires",
                "Argentina",
                new BigDecimal("120000"),
                List.of(
                        "https://picsum.photos/seed/stayhub-palermo-1/800/600",
                        "https://picsum.photos/seed/stayhub-palermo-2/800/600"
                )
        );

        seedAccommodation(
                "Recoleta Jacks Suites",
                "Suites en Recoleta, ubicación ideal para turismo y negocios.",
                AccommodationType.APARTMENT,
                "Buenos Aires",
                "Argentina",
                new BigDecimal("98000"),
                List.of(
                        "https://picsum.photos/seed/stayhub-recoleta-1/800/600",
                        "https://picsum.photos/seed/stayhub-recoleta-2/800/600"
                )
        );

        seedAccommodation(
                "Cordoba Riverside House",
                "Casa amplia cerca del río, ideal para familias.",
                AccommodationType.HOUSE,
                "Córdoba",
                "Argentina",
                new BigDecimal("75000"),
                List.of(
                        "https://picsum.photos/seed/stayhub-cordoba-1/800/600",
                        "https://picsum.photos/seed/stayhub-cordoba-2/800/600"
                )
        );

        seedAccommodation(
                "Bariloche BNB Retreat",
                "Cabañas y desayuno casero, vistas a la montaña.",
                AccommodationType.BNB,
                "San Carlos de Bariloche",
                "Argentina",
                new BigDecimal("110000"),
                List.of(
                        "https://picsum.photos/seed/stayhub-bariloche-1/800/600",
                        "https://picsum.photos/seed/stayhub-bariloche-2/800/600"
                )
        );

        seedAccommodation(
                "Mendoza Hostel Central",
                "Hostel céntrico, ideal para viajeros.",
                AccommodationType.HOSTEL,
                "Mendoza",
                "Argentina",
                new BigDecimal("35000"),
                List.of(
                        "https://picsum.photos/seed/stayhub-mendoza-1/800/600",
                        "https://picsum.photos/seed/stayhub-mendoza-2/800/600"
                )
        );

        
        seedAccommodation(
                "Hotel Puerto Madero Sky",
                "Vista al río y amenities premium.",
                AccommodationType.HOTEL,
                "Buenos Aires",
                "Argentina",
                new BigDecimal("150000"),
                List.of(
                        "https://picsum.photos/seed/stayhub-puerto-1/800/600",
                        "https://picsum.photos/seed/stayhub-puerto-2/800/600"
                )
        );

        seedAccommodation(
                "Salta Colonial Stay",
                "Alojamiento estilo colonial en el centro histórico.",
                AccommodationType.HOTEL,
                "Salta",
                "Argentina",
                new BigDecimal("68000"),
                List.of(
                        "https://picsum.photos/seed/stayhub-salta-1/800/600",
                        "https://picsum.photos/seed/stayhub-salta-2/800/600"
                )
        );

        seedAccommodation(
                "Ushuaia Apartment View",
                "Departamento con vista, ideal para temporada.",
                AccommodationType.APARTMENT,
                "Ushuaia",
                "Argentina",
                new BigDecimal("130000"),
                List.of(
                        "https://picsum.photos/seed/stayhub-ushuaia-1/800/600",
                        "https://picsum.photos/seed/stayhub-ushuaia-2/800/600"
                )
        );

        seedAccommodation(
                "Mar del Plata Beach House",
                "Casa a metros del mar.",
                AccommodationType.HOUSE,
                "Mar del Plata",
                "Argentina",
                new BigDecimal("90000"),
                List.of(
                        "https://picsum.photos/seed/stayhub-mdq-1/800/600",
                        "https://picsum.photos/seed/stayhub-mdq-2/800/600"
                )
        );

        seedAccommodation(
                "Rosario BNB Patio",
                "BNB con patio interno y desayuno.",
                AccommodationType.BNB,
                "Rosario",
                "Argentina",
                new BigDecimal("52000"),
                List.of(
                        "https://picsum.photos/seed/stayhub-rosario-1/800/600",
                        "https://picsum.photos/seed/stayhub-rosario-2/800/600"
                )
        );

        seedAccommodation(
                "La Plata Hostel",
                "Hostel simple y cómodo.",
                AccommodationType.HOSTEL,
                "La Plata",
                "Argentina",
                new BigDecimal("28000"),
                List.of(
                        "https://picsum.photos/seed/stayhub-lp-1/800/600",
                        "https://picsum.photos/seed/stayhub-lp-2/800/600"
                )
        );

        seedAccommodation(
                "Tigre Riverside Apartment",
                "Departamento con vista al delta.",
                AccommodationType.APARTMENT,
                "Tigre",
                "Argentina",
                new BigDecimal("82000"),
                List.of(
                        "https://picsum.photos/seed/stayhub-tigre-1/800/600",
                        "https://picsum.photos/seed/stayhub-tigre-2/800/600"
                )
        );

        System.out.println("[SEED] Inserted initial accommodations ✅");
    }

    private void seedAccommodation(
            String name,
            String description,
            AccommodationType type,
            String city,
            String country,
            BigDecimal pricePerNight,
            List<String> imageUrls
    ) {
        var acc = Accommodation.builder()
                .name(name)
                .description(description)
                .type(type)
                .city(city)
                .country(country)
                .pricePerNight(pricePerNight)
                .build();

        imageUrls.forEach(url -> acc.getImages().add(
                AccommodationImage.builder()
                        .url(url)
                        .accommodation(acc)
                        .build()
        ));

        repo.save(acc);
    }
}