package com.lifestyle.products.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CategoryRequestDto {
    @NotBlank(message = "Category name is required")
    @Size(max = 50, message = "Category name cannot exceed 50 characters")
    private String name;

    @Size(max = 255, message = "Description cannot exceed 255 characters")
    private String description;

    private String imageUrl;

    // No-args constructor
    public CategoryRequestDto() {
    }

    // All-args constructor
    public CategoryRequestDto(String name, String description, String imageUrl) {
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    // Builder pattern
    public static CategoryRequestDtoBuilder builder() {
        return new CategoryRequestDtoBuilder();
    }

    public static class CategoryRequestDtoBuilder {
        private String name;
        private String description;
        private String imageUrl;

        public CategoryRequestDtoBuilder name(String name) {
            this.name = name;
            return this;
        }

        public CategoryRequestDtoBuilder description(String description) {
            this.description = description;
            return this;
        }

        public CategoryRequestDtoBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public CategoryRequestDto build() {
            return new CategoryRequestDto(name, description, imageUrl);
        }
    }
}
