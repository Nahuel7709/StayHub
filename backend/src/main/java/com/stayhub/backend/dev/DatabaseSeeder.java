package com.stayhub.backend.dev;

import com.stayhub.backend.accommodations.*;
import com.stayhub.backend.categories.Category;
import com.stayhub.backend.categories.CategoryRepository;
import com.stayhub.backend.features.Feature;
import com.stayhub.backend.features.FeatureRepository;
import com.stayhub.backend.users.Role;
import com.stayhub.backend.users.User;
import com.stayhub.backend.users.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final AccommodationRepository repo;
    private final CategoryRepository categoryRepository;
    private final FeatureRepository featureRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private Map<String, Feature> featureCatalog = new HashMap<>();

    @Override
    public void run(String... args) {
        seedUsers();
        Map<String, Category> categories = seedCategories();
        this.featureCatalog = seedFeatures();
        seedAccommodations(categories);
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@stayhub.com")) {
            User admin = new User(
                    "Admin",
                    "StayHub",
                    "admin@stayhub.com",
                    passwordEncoder.encode("Admin12345"),
                    Role.ADMIN
            );
            userRepository.save(admin);
            System.out.println("[SEED] Admin user created ✅");
        }

        if (!userRepository.existsByEmail("user@stayhub.com")) {
            User user = new User(
                    "User",
                    "StayHub",
                    "user@stayhub.com",
                    passwordEncoder.encode("User12345"),
                    Role.USER
            );
            userRepository.save(user);
            System.out.println("[SEED] Standard user created ✅");
        }
    }

    private Map<String, Category> seedCategories() {
        Map<String, Category> categories = new HashMap<>();

        categories.put("Ciudad", getOrCreateCategory(
                "Ciudad",
                "Alojamientos urbanos ideales para turismo o viajes de trabajo.",
                "https://picsum.photos/seed/category-city/800/600"
        ));

        categories.put("Playa", getOrCreateCategory(
                "Playa",
                "Opciones cerca del mar para escapadas y vacaciones.",
                "https://picsum.photos/seed/category-beach/800/600"
        ));

        categories.put("Montaña", getOrCreateCategory(
                "Montaña",
                "Alojamientos en zonas de montaña con vistas y naturaleza.",
                "https://picsum.photos/seed/category-mountain/800/600"
        ));

        categories.put("Naturaleza", getOrCreateCategory(
                "Naturaleza",
                "Espacios rodeados de verde, ríos, bosques o paisajes naturales.",
                "https://picsum.photos/seed/category-nature/800/600"
        ));

        categories.put("Viñedos", getOrCreateCategory(
                "Viñedos",
                "Estadías cerca de bodegas y rutas del vino.",
                "https://picsum.photos/seed/category-wine/800/600"
        ));

        System.out.println("[SEED] Categories ready ✅");
        return categories;
    }

    private Category getOrCreateCategory(String name, String description, String imageUrl) {
        return categoryRepository.findAll().stream()
                .filter(c -> c.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseGet(() -> categoryRepository.save(
                        Category.builder()
                                .name(name)
                                .description(description)
                                .imageUrl(imageUrl)
                                .build()
                ));
    }

    private Map<String, Feature> seedFeatures() {
        Map<String, Feature> features = new HashMap<>();

        features.put("Wifi", getOrCreateFeature("Wifi", "wifi"));
        features.put("Pileta", getOrCreateFeature("Pileta", "waves-ladder"));
        features.put("Pet friendly", getOrCreateFeature("Pet friendly", "paw-print"));
        features.put("Estacionamiento", getOrCreateFeature("Estacionamiento", "square-parking"));
        features.put("Televisor", getOrCreateFeature("Televisor", "tv"));
        features.put("Aire acondicionado", getOrCreateFeature("Aire acondicionado", "snowflake"));
        features.put("Cocina", getOrCreateFeature("Cocina", "cooking-pot"));
        features.put("Desayuno", getOrCreateFeature("Desayuno", "utensils"));
        features.put("Baño privado", getOrCreateFeature("Baño privado", "bath"));
        features.put("Gimnasio", getOrCreateFeature("Gimnasio", "dumbbell"));

        System.out.println("[SEED] Features ready ✅");
        return features;
    }

    private Feature getOrCreateFeature(String name, String icon) {
        return featureRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> featureRepository.save(
                        Feature.builder()
                                .name(name)
                                .icon(icon)
                                .build()
                ));
    }

    private Set<Feature> featureSet(String... names) {
        Set<Feature> set = new LinkedHashSet<>();
        for (String name : names) {
            Feature feature = featureCatalog.get(name);
            if (feature != null) {
                set.add(feature);
            }
        }
        return set;
    }

    private Set<Feature> defaultFeaturesFor(AccommodationType type) {
        return switch (type) {
            case HOTEL -> featureSet("Wifi", "Aire acondicionado", "Desayuno", "Baño privado");
            case HOSTEL -> featureSet("Wifi", "Cocina", "Baño privado");
            case APARTMENT -> featureSet("Wifi", "Cocina", "Aire acondicionado", "Baño privado");
            case HOUSE -> featureSet("Wifi", "Cocina", "Estacionamiento", "Pet friendly", "Baño privado");
            case BNB -> featureSet("Wifi", "Desayuno", "Baño privado");
        };
    }

    private void seedAccommodations(Map<String, Category> categories) {
        if (repo.count() > 0) return;

        seedAccommodation(
                "Hotel Palermo Deluxe",
                "Alojamiento premium en Palermo con desayuno incluido.",
                AccommodationType.HOTEL,
                "Buenos Aires",
                "Argentina",
                new BigDecimal("120000"),
                categories.get("Ciudad"),
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
                categories.get("Ciudad"),
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
                categories.get("Naturaleza"),
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
                categories.get("Montaña"),
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
                categories.get("Ciudad"),
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
                categories.get("Ciudad"),
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
                categories.get("Ciudad"),
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
                categories.get("Montaña"),
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
                categories.get("Playa"),
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
                categories.get("Ciudad"),
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
                categories.get("Ciudad"),
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
                categories.get("Naturaleza"),
                List.of(
                        "https://picsum.photos/seed/stayhub-tigre-1/800/600",
                        "https://picsum.photos/seed/stayhub-tigre-2/800/600"
                )
        );

        seedAccommodation(
                "Palermo Soho Studio",
                "Monoambiente moderno a pasos de bares y tiendas.",
                AccommodationType.APARTMENT,
                "Buenos Aires",
                "Argentina",
                new BigDecimal("76000"),
                categories.get("Ciudad"),
                List.of(
                        "https://picsum.photos/seed/stayhub-palermo-1/800/600",
                        "https://picsum.photos/seed/stayhub-palermo-2/800/600"
                )
        );

        seedAccommodation(
                "Recoleta Classic Apartment",
                "Departamento amplio en zona histórica, cerca de parques y museos.",
                AccommodationType.APARTMENT,
                "Buenos Aires",
                "Argentina",
                new BigDecimal("95000"),
                categories.get("Ciudad"),
                List.of(
                        "https://picsum.photos/seed/stayhub-recoleta-1/800/600",
                        "https://picsum.photos/seed/stayhub-recoleta-2/800/600"
                )
        );

        seedAccommodation(
                "San Telmo Loft House",
                "Casa tipo loft con patio interno, ideal para escapada urbana.",
                AccommodationType.HOUSE,
                "Buenos Aires",
                "Argentina",
                new BigDecimal("110000"),
                categories.get("Ciudad"),
                List.of(
                        "https://picsum.photos/seed/stayhub-santelmo-1/800/600",
                        "https://picsum.photos/seed/stayhub-santelmo-2/800/600"
                )
        );

        seedAccommodation(
                "Puerto Madero Premium Stay",
                "Alojamiento premium con vista a la ciudad y excelente ubicación.",
                AccommodationType.HOTEL,
                "Buenos Aires",
                "Argentina",
                new BigDecimal("180000"),
                categories.get("Ciudad"),
                List.of(
                        "https://picsum.photos/seed/stayhub-puertomadero-1/800/600",
                        "https://picsum.photos/seed/stayhub-puertomadero-2/800/600"
                )
        );

        seedAccommodation(
                "Bariloche Lakeside House",
                "Casa cálida con vista al lago, calefacción y parrilla.",
                AccommodationType.HOUSE,
                "San Carlos de Bariloche",
                "Argentina",
                new BigDecimal("210000"),
                categories.get("Montaña"),
                List.of(
                        "https://picsum.photos/seed/stayhub-bariloche-1/800/600",
                        "https://picsum.photos/seed/stayhub-bariloche-2/800/600"
                )
        );

        seedAccommodation(
                "Villa La Angostura BnB",
                "BnB tranquilo rodeado de bosque, desayuno casero incluido.",
                AccommodationType.BNB,
                "Villa La Angostura",
                "Argentina",
                new BigDecimal("140000"),
                categories.get("Montaña"),
                List.of(
                        "https://picsum.photos/seed/stayhub-angostura-1/800/600",
                        "https://picsum.photos/seed/stayhub-angostura-2/800/600"
                )
        );

        seedAccommodation(
                "San Martín de los Andes Mountain BnB",
                "BnB con vista a la montaña, ambiente familiar y cálido.",
                AccommodationType.BNB,
                "San Martín de los Andes",
                "Argentina",
                new BigDecimal("155000"),
                categories.get("Montaña"),
                List.of(
                        "https://picsum.photos/seed/stayhub-sma-1/800/600",
                        "https://picsum.photos/seed/stayhub-sma-2/800/600"
                )
        );

        seedAccommodation(
                "Mendoza Wine Route Hotel",
                "Hotel boutique cerca de bodegas, con desayuno incluido.",
                AccommodationType.HOTEL,
                "Mendoza",
                "Argentina",
                new BigDecimal("160000"),
                categories.get("Viñedos"),
                List.of(
                        "https://picsum.photos/seed/stayhub-mendoza-1/800/600",
                        "https://picsum.photos/seed/stayhub-mendoza-2/800/600"
                )
        );

        seedAccommodation(
                "Chacras de Coria BnB",
                "BnB con jardín y pileta, ideal para descansar entre viñedos.",
                AccommodationType.BNB,
                "Luján de Cuyo",
                "Argentina",
                new BigDecimal("175000"),
                categories.get("Viñedos"),
                List.of(
                        "https://picsum.photos/seed/stayhub-chacras-1/800/600",
                        "https://picsum.photos/seed/stayhub-chacras-2/800/600"
                )
        );

        seedAccommodation(
                "Nueva Córdoba Central Apartment",
                "Departamento cómodo cerca de universidades y parques.",
                AccommodationType.APARTMENT,
                "Córdoba",
                "Argentina",
                new BigDecimal("65000"),
                categories.get("Ciudad"),
                List.of(
                        "https://picsum.photos/seed/stayhub-cordoba-1/800/600",
                        "https://picsum.photos/seed/stayhub-cordoba-2/800/600"
                )
        );

        seedAccommodation(
                "Salta Colonial Hotel",
                "Hotel con encanto colonial en el centro, patio y terraza.",
                AccommodationType.HOTEL,
                "Salta",
                "Argentina",
                new BigDecimal("120000"),
                categories.get("Ciudad"),
                List.of(
                        "https://picsum.photos/seed/stayhub-salta-1/800/600",
                        "https://picsum.photos/seed/stayhub-salta-2/800/600"
                )
        );

        seedAccommodation(
                "Puerto Iguazú Falls Hostel",
                "Hostel social y limpio, ideal para visitar Cataratas.",
                AccommodationType.HOSTEL,
                "Puerto Iguazú",
                "Argentina",
                new BigDecimal("42000"),
                categories.get("Naturaleza"),
                List.of(
                        "https://picsum.photos/seed/stayhub-iguazu-1/800/600",
                        "https://picsum.photos/seed/stayhub-iguazu-2/800/600"
                )
        );

        seedAccommodation(
                "El Calafate Glaciar Hostel",
                "Hostel cálido con cocina compartida, cerca del centro.",
                AccommodationType.HOSTEL,
                "El Calafate",
                "Argentina",
                new BigDecimal("45000"),
                categories.get("Naturaleza"),
                List.of(
                        "https://picsum.photos/seed/stayhub-calafate-1/800/600",
                        "https://picsum.photos/seed/stayhub-calafate-2/800/600"
                )
        );

        seedAccommodation(
                "Ushuaia End of the World Hotel",
                "Hotel acogedor con vista al canal, excelente calefacción.",
                AccommodationType.HOTEL,
                "Ushuaia",
                "Argentina",
                new BigDecimal("190000"),
                categories.get("Montaña"),
                List.of(
                        "https://picsum.photos/seed/stayhub-ushuaia-1/800/600",
                        "https://picsum.photos/seed/stayhub-ushuaia-2/800/600"
                )
        );

        seedAccommodation(
                "Mar del Plata Oceanfront Apartment",
                "Departamento frente al mar, ideal para verano.",
                AccommodationType.APARTMENT,
                "Mar del Plata",
                "Argentina",
                new BigDecimal("98000"),
                categories.get("Playa"),
                List.of(
                        "https://picsum.photos/seed/stayhub-mdq-1/800/600",
                        "https://picsum.photos/seed/stayhub-mdq-2/800/600"
                )
        );

        seedAccommodation(
                "Rosario Riverside Hotel",
                "Hotel con vista al río Paraná, ubicación céntrica.",
                AccommodationType.HOTEL,
                "Rosario",
                "Argentina",
                new BigDecimal("115000"),
                categories.get("Ciudad"),
                List.of(
                        "https://picsum.photos/seed/stayhub-rosario-1/800/600",
                        "https://picsum.photos/seed/stayhub-rosario-2/800/600"
                )
        );

        seedAccommodation(
                "Cafayate Vineyards BnB",
                "BnB entre viñedos, desayuno regional y ambiente tranquilo.",
                AccommodationType.BNB,
                "Cafayate",
                "Argentina",
                new BigDecimal("135000"),
                categories.get("Viñedos"),
                List.of(
                        "https://picsum.photos/seed/stayhub-cafayate-1/800/600",
                        "https://picsum.photos/seed/stayhub-cafayate-2/800/600"
                )
        );

        seedAccommodation(
                "Tilcara Adobe House",
                "Casa estilo adobe, silenciosa y con vista a los cerros.",
                AccommodationType.HOUSE,
                "Tilcara",
                "Argentina",
                new BigDecimal("90000"),
                categories.get("Montaña"),
                List.of(
                        "https://picsum.photos/seed/stayhub-tilcara-1/800/600",
                        "https://picsum.photos/seed/stayhub-tilcara-2/800/600"
                )
        );

        seedAccommodation(
                "San Rafael River House",
                "Casa completa cerca del río, ideal para familias y amigos.",
                AccommodationType.HOUSE,
                "San Rafael",
                "Argentina",
                new BigDecimal("125000"),
                categories.get("Naturaleza"),
                List.of(
                        "https://picsum.photos/seed/stayhub-sanrafael-1/800/600",
                        "https://picsum.photos/seed/stayhub-sanrafael-2/800/600"
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
            Category category,
            List<String> imageUrls
    ) {
        var acc = Accommodation.builder()
                .name(name)
                .description(description)
                .type(type)
                .city(city)
                .country(country)
                .pricePerNight(pricePerNight)
                .category(category)
                .features(defaultFeaturesFor(type))
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