package com.lifestyle.products.dto;

public class CategoryDto {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;

    // No-args constructor
    public CategoryDto() {
    }

    // All-args constructor
    public CategoryDto(Long id, String name, String description, String imageUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
    public static CategoryDtoBuilder builder() {
        return new CategoryDtoBuilder();
    }

    public static class CategoryDtoBuilder {
        private Long id;
        private String name;
        private String description;
        private String imageUrl;

        public CategoryDtoBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public CategoryDtoBuilder name(String name) {
            this.name = name;
            return this;
        }

        public CategoryDtoBuilder description(String description) {
            this.description = description;
            return this;
        }

        public CategoryDtoBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public CategoryDto build() {
            return new CategoryDto(id, name, description, imageUrl);
        }
    }
}
