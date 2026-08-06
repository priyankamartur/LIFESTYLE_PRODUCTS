package com.lifestyle.products.dto;

import java.math.BigDecimal;

public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private Boolean featured;
    private Long categoryId;
    private String categoryName;
    private Integer stockQuantity = 100;

    // No-args constructor
    public ProductDto() {
    }

    // All-args constructor
    public ProductDto(Long id, String name, String description, BigDecimal price, String imageUrl, Boolean featured, Long categoryId, String categoryName, Integer stockQuantity) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.featured = featured;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.stockQuantity = stockQuantity != null ? stockQuantity : 100;
    }

    public ProductDto(Long id, String name, String description, BigDecimal price, String imageUrl, Boolean featured, Long categoryId, String categoryName) {
        this(id, name, description, price, imageUrl, featured, categoryId, categoryName, 100);
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

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    // Builder Pattern
    public static ProductDtoBuilder builder() {
        return new ProductDtoBuilder();
    }

    public static class ProductDtoBuilder {
        private Long id;
        private String name;
        private String description;
        private BigDecimal price;
        private String imageUrl;
        private Boolean featured;
        private Long categoryId;
        private String categoryName;
        private Integer stockQuantity = 100;

        public ProductDtoBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ProductDtoBuilder name(String name) {
            this.name = name;
            return this;
        }

        public ProductDtoBuilder description(String description) {
            this.description = description;
            return this;
        }

        public ProductDtoBuilder price(BigDecimal price) {
            this.price = price;
            return this;
        }

        public ProductDtoBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public ProductDtoBuilder featured(Boolean featured) {
            this.featured = featured;
            return this;
        }

        public ProductDtoBuilder categoryId(Long categoryId) {
            this.categoryId = categoryId;
            return this;
        }

        public ProductDtoBuilder categoryName(String categoryName) {
            this.categoryName = categoryName;
            return this;
        }

        public ProductDtoBuilder stockQuantity(Integer stockQuantity) {
            this.stockQuantity = stockQuantity;
            return this;
        }

        public ProductDto build() {
            return new ProductDto(id, name, description, price, imageUrl, featured, categoryId, categoryName, stockQuantity);
        }
    }
}
