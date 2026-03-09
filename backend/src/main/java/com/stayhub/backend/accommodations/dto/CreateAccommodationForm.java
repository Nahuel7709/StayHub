package com.stayhub.backend.accommodations.dto;

import com.stayhub.backend.accommodations.AccommodationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

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

    private BigDecimal pricePerNight;

    // ✅ Multipart files
    private MultipartFile[] images;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public AccommodationType getType() { return type; }
    public void setType(AccommodationType type) { this.type = type; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    private String categoryId;

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public BigDecimal getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(BigDecimal pricePerNight) { this.pricePerNight = pricePerNight; }

    public MultipartFile[] getImages() { return images; }
    public void setImages(MultipartFile[] images) { this.images = images; }
}
