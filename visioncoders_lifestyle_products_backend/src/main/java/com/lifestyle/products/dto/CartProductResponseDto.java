package com.lifestyle.products.dto;

import java.math.BigDecimal;

public class CartProductResponseDto {
    private Long productId;
    private String name;
    private String description;
    private String imageUrl;
    private BigDecimal pricePerUnit;
    private Integer quantity;
    private BigDecimal totalPrice;

    public CartProductResponseDto() {
    }

    public CartProductResponseDto(Long productId, String name, String description, String imageUrl, BigDecimal pricePerUnit, Integer quantity, BigDecimal totalPrice) {
        this.productId = productId;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.pricePerUnit = pricePerUnit;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
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

    public BigDecimal getPricePerUnit() {
        return pricePerUnit;
    }

    public void setPricePerUnit(BigDecimal pricePerUnit) {
        this.pricePerUnit = pricePerUnit;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public static CartProductResponseDtoBuilder builder() {
        return new CartProductResponseDtoBuilder();
    }

    public static class CartProductResponseDtoBuilder {
        private Long productId;
        private String name;
        private String description;
        private String imageUrl;
        private BigDecimal pricePerUnit;
        private Integer quantity;
        private BigDecimal totalPrice;

        public CartProductResponseDtoBuilder productId(Long productId) {
            this.productId = productId;
            return this;
        }

        public CartProductResponseDtoBuilder name(String name) {
            this.name = name;
            return this;
        }

        public CartProductResponseDtoBuilder description(String description) {
            this.description = description;
            return this;
        }

        public CartProductResponseDtoBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public CartProductResponseDtoBuilder pricePerUnit(BigDecimal pricePerUnit) {
            this.pricePerUnit = pricePerUnit;
            return this;
        }

        public CartProductResponseDtoBuilder quantity(Integer quantity) {
            this.quantity = quantity;
            return this;
        }

        public CartProductResponseDtoBuilder totalPrice(BigDecimal totalPrice) {
            this.totalPrice = totalPrice;
            return this;
        }

        public CartProductResponseDto build() {
            return new CartProductResponseDto(productId, name, description, imageUrl, pricePerUnit, quantity, totalPrice);
        }
    }
}
