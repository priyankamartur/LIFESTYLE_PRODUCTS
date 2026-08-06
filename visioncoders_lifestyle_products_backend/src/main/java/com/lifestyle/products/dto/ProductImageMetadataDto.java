package com.lifestyle.products.dto;

import jakarta.validation.constraints.NotBlank;

public class ProductImageMetadataDto {
    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    // No-args constructor
    public ProductImageMetadataDto() {
    }

    // All-args constructor
    public ProductImageMetadataDto(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    // Getter and Setter
    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    // Builder
    public static ProductImageMetadataDtoBuilder builder() {
        return new ProductImageMetadataDtoBuilder();
    }

    public static class ProductImageMetadataDtoBuilder {
        private String imageUrl;

        public ProductImageMetadataDtoBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public ProductImageMetadataDto build() {
            return new ProductImageMetadataDto(imageUrl);
        }
    }
}
