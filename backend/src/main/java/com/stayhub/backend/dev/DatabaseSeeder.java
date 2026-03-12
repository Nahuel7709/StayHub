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
import com.stayhub.backend.reservations.Reservation;
import com.stayhub.backend.reservations.ReservationRepository;
import com.stayhub.backend.reservations.ReservationStatus;


import java.time.LocalDate;
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
    private final ReservationRepository reservationRepository;

    private Map<String, Feature> featureCatalog = new HashMap<>();

    @Override
    public void run(String... args) {
        seedUsers();
        Map<String, Category> categories = seedCategories();
        this.featureCatalog = seedFeatures();
        seedAccommodations(categories);
        seedReservations();
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

    private String defaultHouseRulesFor(AccommodationType type) {
        return switch (type) {
            case HOTEL -> """
                    - Check-in a partir de las 15:00
                    - Check-out hasta las 11:00
                    - No se permite fumar dentro de la habitación
                    - No se permiten fiestas o eventos
                    - Respetar horarios de descanso del establecimiento
                    """;

            case HOSTEL -> """
                    - Check-in a partir de las 14:00
                    - Check-out hasta las 10:00
                    - Respetar el descanso en habitaciones compartidas
                    - Mantener limpios los espacios comunes
                    - No se permite el ingreso de personas no registradas
                    """;

            case APARTMENT -> """
                    - Check-in a partir de las 15:00
                    - Check-out hasta las 11:00
                    - No se permiten fiestas ni reuniones numerosas
                    - Cuidar el mobiliario y los electrodomésticos
                    - Respetar las normas de convivencia del edificio
                    """;

            case HOUSE -> """
                    - Check-in a partir de las 15:00
                    - Check-out hasta las 11:00
                    - No se permiten fiestas ni eventos sin autorización
                    - Mantener el orden y cuidado general de la propiedad
                    - Respetar horarios de descanso del barrio
                    """;

            case BNB -> """
                    - Check-in a partir de las 14:00
                    - Check-out hasta las 11:00
                    - Respetar los horarios de desayuno informados por el anfitrión
                    - No se permite fumar en ambientes interiores
                    - Mantener un ambiente tranquilo para todos los huéspedes
                    """;
        };
    }

    private String defaultHealthAndSafetyFor(AccommodationType type) {
        return switch (type) {
            case HOTEL -> """
                    - El establecimiento cuenta con salidas de emergencia señalizadas
                    - Se realiza limpieza y cambio de ropa blanca entre estadías
                    - El personal puede asistir ante emergencias básicas
                    - Se recomienda verificar el plano de evacuación al ingresar
                    """;

            case HOSTEL -> """
                    - Se higienizan baños y espacios comunes de forma periódica
                    - Se recomienda guardar pertenencias en lugares seguros
                    - Identificar salidas de emergencia al momento del ingreso
                    - Mantener despejadas camas, pasillos y zonas compartidas
                    """;

            case APARTMENT -> """
                    - El alojamiento cuenta con elementos básicos de primeros auxilios
                    - Verificar cierre de puertas y ventanas al salir
                    - No dejar artefactos eléctricos encendidos sin supervisión
                    - En caso de emergencia, seguir las indicaciones del edificio
                    """;

            case HOUSE -> """
                    - La propiedad cuenta con elementos básicos de primeros auxilios
                    - Revisar accesos y cerraduras antes de salir
                    - No dejar fuego, parrilla o cocina sin supervisión
                    - Mantener libres los accesos y salidas principales
                    """;

            case BNB -> """
                    - Se realiza limpieza entre cada estadía
                    - Consultar al anfitrión ante cualquier situación de emergencia
                    - Mantener cerradas puertas y ventanas cuando no haya nadie
                    - Identificar salidas y accesos al momento del check-in
                    """;
        };
    }

    private String defaultCancellationPolicyFor(AccommodationType type) {
        return switch (type) {
            case HOTEL -> """
                    - Cancelación gratuita hasta 7 días antes del check-in
                    - Entre 7 días y 48 horas antes se reintegra el 50%
                    - Menos de 48 horas antes no corresponde reintegro
                    """;

            case HOSTEL -> """
                    - Cancelación gratuita hasta 5 días antes del check-in
                    - Entre 5 días y 24 horas antes se reintegra el 50%
                    - Menos de 24 horas antes no corresponde reintegro
                    """;

            case APARTMENT -> """
                    - Cancelación gratuita hasta 7 días antes del check-in
                    - Entre 7 días y 72 horas antes se reintegra el 50%
                    - Menos de 72 horas antes no corresponde reintegro
                    """;

            case HOUSE -> """
                    - Cancelación gratuita hasta 10 días antes del check-in
                    - Entre 10 días y 5 días antes se reintegra el 50%
                    - Menos de 5 días antes no corresponde reintegro
                    """;

            case BNB -> """
                    - Cancelación gratuita hasta 7 días antes del check-in
                    - Entre 7 días y 48 horas antes se reintegra el 50%
                    - Menos de 48 horas antes no corresponde reintegro
                    """;
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
                ),
                defaultHouseRulesFor(AccommodationType.HOTEL),
                defaultHealthAndSafetyFor(AccommodationType.HOTEL),
                defaultCancellationPolicyFor(AccommodationType.HOTEL)
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
                ),
                defaultHouseRulesFor(AccommodationType.APARTMENT),
                defaultHealthAndSafetyFor(AccommodationType.APARTMENT),
                defaultCancellationPolicyFor(AccommodationType.APARTMENT)
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
                ),
                defaultHouseRulesFor(AccommodationType.HOUSE),
                defaultHealthAndSafetyFor(AccommodationType.HOUSE),
                defaultCancellationPolicyFor(AccommodationType.HOUSE)
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
                ),
                defaultHouseRulesFor(AccommodationType.BNB),
                defaultHealthAndSafetyFor(AccommodationType.BNB),
                defaultCancellationPolicyFor(AccommodationType.BNB)
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
                ),
                defaultHouseRulesFor(AccommodationType.HOSTEL),
                defaultHealthAndSafetyFor(AccommodationType.HOSTEL),
                defaultCancellationPolicyFor(AccommodationType.HOSTEL)
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
                ),
                defaultHouseRulesFor(AccommodationType.HOTEL),
                defaultHealthAndSafetyFor(AccommodationType.HOTEL),
                defaultCancellationPolicyFor(AccommodationType.HOTEL)
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
                ),
                defaultHouseRulesFor(AccommodationType.HOTEL),
                defaultHealthAndSafetyFor(AccommodationType.HOTEL),
                defaultCancellationPolicyFor(AccommodationType.HOTEL)
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
                ),
                defaultHouseRulesFor(AccommodationType.APARTMENT),
                defaultHealthAndSafetyFor(AccommodationType.APARTMENT),
                defaultCancellationPolicyFor(AccommodationType.APARTMENT)
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
                ),
                defaultHouseRulesFor(AccommodationType.HOUSE),
                defaultHealthAndSafetyFor(AccommodationType.HOUSE),
                defaultCancellationPolicyFor(AccommodationType.HOUSE)
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
                ),
                defaultHouseRulesFor(AccommodationType.BNB),
                defaultHealthAndSafetyFor(AccommodationType.BNB),
                defaultCancellationPolicyFor(AccommodationType.BNB)
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
                ),
                defaultHouseRulesFor(AccommodationType.HOSTEL),
                defaultHealthAndSafetyFor(AccommodationType.HOSTEL),
                defaultCancellationPolicyFor(AccommodationType.HOSTEL)
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
                ),
                defaultHouseRulesFor(AccommodationType.APARTMENT),
                defaultHealthAndSafetyFor(AccommodationType.APARTMENT),
                defaultCancellationPolicyFor(AccommodationType.APARTMENT)
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
                ),
                defaultHouseRulesFor(AccommodationType.APARTMENT),
                defaultHealthAndSafetyFor(AccommodationType.APARTMENT),
                defaultCancellationPolicyFor(AccommodationType.APARTMENT)
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
                ),
                defaultHouseRulesFor(AccommodationType.APARTMENT),
                defaultHealthAndSafetyFor(AccommodationType.APARTMENT),
                defaultCancellationPolicyFor(AccommodationType.APARTMENT)
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
                ),
                defaultHouseRulesFor(AccommodationType.HOUSE),
                defaultHealthAndSafetyFor(AccommodationType.HOUSE),
                defaultCancellationPolicyFor(AccommodationType.HOUSE)
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
                ),
                defaultHouseRulesFor(AccommodationType.HOTEL),
                defaultHealthAndSafetyFor(AccommodationType.HOTEL),
                defaultCancellationPolicyFor(AccommodationType.HOTEL)
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
                ),
                defaultHouseRulesFor(AccommodationType.HOUSE),
                defaultHealthAndSafetyFor(AccommodationType.HOUSE),
                defaultCancellationPolicyFor(AccommodationType.HOUSE)
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
                ),
                defaultHouseRulesFor(AccommodationType.BNB),
                defaultHealthAndSafetyFor(AccommodationType.BNB),
                defaultCancellationPolicyFor(AccommodationType.BNB)
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
                ),
                defaultHouseRulesFor(AccommodationType.BNB),
                defaultHealthAndSafetyFor(AccommodationType.BNB),
                defaultCancellationPolicyFor(AccommodationType.BNB)
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
                ),
                defaultHouseRulesFor(AccommodationType.HOTEL),
                defaultHealthAndSafetyFor(AccommodationType.HOTEL),
                defaultCancellationPolicyFor(AccommodationType.HOTEL)
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
                ),
                defaultHouseRulesFor(AccommodationType.BNB),
                defaultHealthAndSafetyFor(AccommodationType.BNB),
                defaultCancellationPolicyFor(AccommodationType.BNB)
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
                ),
                defaultHouseRulesFor(AccommodationType.APARTMENT),
                defaultHealthAndSafetyFor(AccommodationType.APARTMENT),
                defaultCancellationPolicyFor(AccommodationType.APARTMENT)
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
                ),
                defaultHouseRulesFor(AccommodationType.HOTEL),
                defaultHealthAndSafetyFor(AccommodationType.HOTEL),
                defaultCancellationPolicyFor(AccommodationType.HOTEL)
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
                ),
                defaultHouseRulesFor(AccommodationType.HOSTEL),
                defaultHealthAndSafetyFor(AccommodationType.HOSTEL),
                defaultCancellationPolicyFor(AccommodationType.HOSTEL)
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
                ),
                defaultHouseRulesFor(AccommodationType.HOSTEL),
                defaultHealthAndSafetyFor(AccommodationType.HOSTEL),
                defaultCancellationPolicyFor(AccommodationType.HOSTEL)
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
                ),
                defaultHouseRulesFor(AccommodationType.HOTEL),
                defaultHealthAndSafetyFor(AccommodationType.HOTEL),
                defaultCancellationPolicyFor(AccommodationType.HOTEL)
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
                ),
                defaultHouseRulesFor(AccommodationType.APARTMENT),
                defaultHealthAndSafetyFor(AccommodationType.APARTMENT),
                defaultCancellationPolicyFor(AccommodationType.APARTMENT)
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
                ),
                defaultHouseRulesFor(AccommodationType.HOTEL),
                defaultHealthAndSafetyFor(AccommodationType.HOTEL),
                defaultCancellationPolicyFor(AccommodationType.HOTEL)
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
                ),
                defaultHouseRulesFor(AccommodationType.BNB),
                defaultHealthAndSafetyFor(AccommodationType.BNB),
                defaultCancellationPolicyFor(AccommodationType.BNB)
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
                ),
                defaultHouseRulesFor(AccommodationType.HOUSE),
                defaultHealthAndSafetyFor(AccommodationType.HOUSE),
                defaultCancellationPolicyFor(AccommodationType.HOUSE)
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
                ),
                defaultHouseRulesFor(AccommodationType.HOUSE),
                defaultHealthAndSafetyFor(AccommodationType.HOUSE),
                defaultCancellationPolicyFor(AccommodationType.HOUSE)
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
            List<String> imageUrls,
            String houseRules,
            String healthAndSafety,
            String cancellationPolicy
    ) {
        var acc = Accommodation.builder()
                .name(name)
                .description(description)
                .type(type)
                .city(city)
                .country(country)
                .pricePerNight(pricePerNight)
                .houseRules(houseRules)
                .healthAndSafety(healthAndSafety)
                .cancellationPolicy(cancellationPolicy)
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

    private void seedReservations() {
        if (reservationRepository.count() > 0) return;

        LocalDate today = LocalDate.now();

        seedReservation(
                "Hotel Palermo Deluxe",
                "user@stayhub.com",
                today.minusDays(20),
                today.minusDays(17),
                ReservationStatus.CONFIRMED
        );

        seedReservation(
                "Bariloche BNB Retreat",
                "user@stayhub.com",
                today.minusDays(12),
                today.minusDays(9),
                ReservationStatus.CONFIRMED
        );


        seedReservation(
                "Hotel Palermo Deluxe",
                "user@stayhub.com",
                today.plusDays(5),
                today.plusDays(9),
                ReservationStatus.CONFIRMED
        );

        seedReservation(
                "Hotel Palermo Deluxe",
                "user@stayhub.com",
                today.plusDays(15),
                today.plusDays(18),
                ReservationStatus.PENDING
        );

        seedReservation(
                "Hotel Palermo Deluxe",
                "user@stayhub.com",
                today.plusDays(25),
                today.plusDays(27),
                ReservationStatus.CANCELLED
        );

        seedReservation(
                "Tigre Riverside Apartment",
                "user@stayhub.com",
                today.plusDays(8),
                today.plusDays(12),
                ReservationStatus.CONFIRMED
        );

        seedReservation(
                "Mendoza Hostel Central",
                "user@stayhub.com",
                today.plusDays(3),
                today.plusDays(6),
                ReservationStatus.PENDING
        );

        seedReservation(
                "Mar del Plata Beach House",
                "user@stayhub.com",
                today.plusDays(10),
                today.plusDays(13),
                ReservationStatus.CANCELLED
        );

        seedReservation(
                "Bariloche BNB Retreat",
                "user@stayhub.com",
                today.plusDays(20),
                today.plusDays(24),
                ReservationStatus.CONFIRMED
        );

        System.out.println("[SEED] Reservations ready ✅");
    }

    private void seedReservation(
            String accommodationName,
            String userEmail,
            LocalDate checkIn,
            LocalDate checkOut,
            ReservationStatus status
    ) {
        if (!checkIn.isBefore(checkOut)) {
            throw new IllegalArgumentException("checkIn debe ser anterior a checkOut");
        }

        Accommodation accommodation = repo.findByNameIgnoreCase(accommodationName)
                .orElseThrow(() -> new IllegalStateException(
                        "No se encontró el alojamiento para seed: " + accommodationName
                ));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException(
                        "No se encontró el usuario para seed: " + userEmail
                ));

        Reservation reservation = Reservation.builder()
                .accommodation(accommodation)
                .user(user)
                .checkIn(checkIn)
                .checkOut(checkOut)
                .status(status)
                .build();

        reservationRepository.save(reservation);
    }
}