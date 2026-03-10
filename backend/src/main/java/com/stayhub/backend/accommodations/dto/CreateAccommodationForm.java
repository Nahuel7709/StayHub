package com.stayhub.backend.accommodations.dto;

import com.stayhub.backend.accommodations.AccommodationType;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class CreateAccommodationForm {

    @NotBlank
    @Size(max = 120)
    private String name;

    @NotBlank
    @Size(max = 2000)
    private String description;

    @NotNull
    private AccommodationType type;

    @NotBlank
    @Size(max = 80)
    private String city;

    @NotBlank
    @Size(max = 80)
    private String country;

    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal pricePerNight;

    private String categoryId;

    private List<String> featureIds;

    private MultipartFile[] images;

    @Size(max = 2000)
    private String houseRules;

    @Size(max = 2000)
    private String healthAndSafety;

    @Size(max = 2000)
    private String cancellationPolicy;
}