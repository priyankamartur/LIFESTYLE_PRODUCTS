package com.lifestyle.products.dto;

import java.math.BigDecimal;

public class OrderItemResponseDto {
    private Long id;
    private Long productId;
    private String productName;
    private String productDescription;
    private String productImageUrl;
    private String category;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal totalPrice;

    // No-args constructor
    public OrderItemResponseDto() {
    }

    // All-args constructor
    public OrderItemResponseDto(Long id, Long productId, String productName, String productDescription, 
                                String productImageUrl, String category, Integer quantity, 
                                BigDecimal price, BigDecimal totalPrice) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.productDescription = productDescription;
        this.productImageUrl = productImageUrl;
        this.category = category;
        this.quantity = quantity;
        this.price = price;
        this.totalPrice = totalPrice;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductDescription() { return productDescription; }
    public void setProductDescription(String productDescription) { this.productDescription = productDescription; }

    public String getProductImageUrl() { return productImageUrl; }
    public void setProductImageUrl(String productImageUrl) { this.productImageUrl = productImageUrl; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    // Builder method
    public static OrderItemResponseDtoBuilder builder() {
        return new OrderItemResponseDtoBuilder();
    }

    // Builder class
    public static class OrderItemResponseDtoBuilder {
        private Long id;
        private Long productId;
        private String productName;
        private String productDescription;
        private String productImageUrl;
        private String category;
        private Integer quantity;
        private BigDecimal price;
        private BigDecimal totalPrice;

        public OrderItemResponseDtoBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public OrderItemResponseDtoBuilder productId(Long productId) {
            this.productId = productId;
            return this;
        }

        public OrderItemResponseDtoBuilder productName(String productName) {
            this.productName = productName;
            return this;
        }

        public OrderItemResponseDtoBuilder productDescription(String productDescription) {
            this.productDescription = productDescription;
            return this;
        }

        public OrderItemResponseDtoBuilder productImageUrl(String productImageUrl) {
            this.productImageUrl = productImageUrl;
            return this;
        }

        public OrderItemResponseDtoBuilder category(String category) {
            this.category = category;
            return this;
        }

        public OrderItemResponseDtoBuilder quantity(Integer quantity) {
            this.quantity = quantity;
            return this;
        }

        public OrderItemResponseDtoBuilder price(BigDecimal price) {
            this.price = price;
            return this;
        }

        public OrderItemResponseDtoBuilder totalPrice(BigDecimal totalPrice) {
            this.totalPrice = totalPrice;
            return this;
        }

        public OrderItemResponseDto build() {
            return new OrderItemResponseDto(id, productId, productName, productDescription, productImageUrl, category, quantity, price, totalPrice);
        }
    }
}
