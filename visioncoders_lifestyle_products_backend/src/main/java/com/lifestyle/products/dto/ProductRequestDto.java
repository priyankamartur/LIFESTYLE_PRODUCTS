package com.lifestyle.products.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class ProductRequestDto {
    @NotBlank(message = "Product name is required")
    @Size(max = 100, message = "Product name cannot exceed 100 characters")
    private String name;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than zero")
    private BigDecimal price;

    private String imageUrl;

    private Boolean featured;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @jakarta.validation.constraints.Min(value = 0, message = "Stock quantity cannot be negative")
    private Integer stockQuantity = 100;

    // No-args constructor
    public ProductRequestDto() {
    }

    // All-args constructor
    public ProductRequestDto(String name, String description, BigDecimal price, String imageUrl, Boolean featured, Long categoryId, Integer stockQuantity) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.featured = featured;
        this.categoryId = categoryId;
        this.stockQuantity = stockQuantity != null ? stockQuantity : 100;
    }

    public ProductRequestDto(String name, String description, BigDecimal price, String imageUrl, Boolean featured, Long categoryId) {
        this(name, description, price, imageUrl, featured, categoryId, 100);
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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getFeatured() {
        return featured;
    }

    public void setFeatured(Boolean featured) {
        this.featured = featured;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    // Builder
    public static ProductRequestDtoBuilder builder() {
        return new ProductRequestDtoBuilder();
    }

    public static class ProductRequestDtoBuilder {
        private String name;
        private String description;
        private BigDecimal price;
        private String imageUrl;
        private Boolean featured;
        private Long categoryId;
        private Integer stockQuantity = 100;

        public ProductRequestDtoBuilder name(String name) {
            this.name = name;
            return this;
        }

        public ProductRequestDtoBuilder description(String description) {
            this.description = description;
            return this;
        }

        public ProductRequestDtoBuilder price(BigDecimal price) {
            this.price = price;
            return this;
        }

        public ProductRequestDtoBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public ProductRequestDtoBuilder featured(Boolean featured) {
            this.featured = featured;
            return this;
        }

        public ProductRequestDtoBuilder categoryId(Long categoryId) {
            this.categoryId = categoryId;
            return this;
        }

        public ProductRequestDtoBuilder stockQuantity(Integer stockQuantity) {
            this.stockQuantity = stockQuantity;
            return this;
        }

        public ProductRequestDto build() {
            return new ProductRequestDto(name, description, price, imageUrl, featured, categoryId, stockQuantity);
        }
    }
}
