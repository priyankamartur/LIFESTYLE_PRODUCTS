package com.lifestyle.products.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OrderHistoryItemDto {
    private String username;
    private String role;
    private Long orderId;
    private Long productId;
    private String productName;
    private String productDescription;
    private String productImageUrl;
    private String category;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal totalPrice;
    private String orderStatus;
    private LocalDateTime orderDate;

    // Constructors
    public OrderHistoryItemDto() {
    }

    public OrderHistoryItemDto(String username, String role, Long orderId, Long productId, String productName, 
                               String productDescription, String productImageUrl, String category, 
                               Integer quantity, BigDecimal price, BigDecimal totalPrice, 
                               String orderStatus, LocalDateTime orderDate) {
        this.username = username;
        this.role = role;
        this.orderId = orderId;
        this.productId = productId;
        this.productName = productName;
        this.productDescription = productDescription;
        this.productImageUrl = productImageUrl;
        this.category = category;
        this.quantity = quantity;
        this.price = price;
        this.totalPrice = totalPrice;
        this.orderStatus = orderStatus;
        this.orderDate = orderDate;
    }

    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

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

    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    // Builder method
    public static OrderHistoryItemDtoBuilder builder() {
        return new OrderHistoryItemDtoBuilder();
    }

    // Builder class
    public static class OrderHistoryItemDtoBuilder {
        private String username;
        private String role;
        private Long orderId;
        private Long productId;
        private String productName;
        private String productDescription;
        private String productImageUrl;
        private String category;
        private Integer quantity;
        private BigDecimal price;
        private BigDecimal totalPrice;
        private String orderStatus;
        private LocalDateTime orderDate;

        public OrderHistoryItemDtoBuilder username(String username) {
            this.username = username;
            return this;
        }

        public OrderHistoryItemDtoBuilder role(String role) {
            this.role = role;
            return this;
        }

        public OrderHistoryItemDtoBuilder orderId(Long orderId) {
            this.orderId = orderId;
            return this;
        }

        public OrderHistoryItemDtoBuilder productId(Long productId) {
            this.productId = productId;
            return this;
        }

        public OrderHistoryItemDtoBuilder productName(String productName) {
            this.productName = productName;
            return this;
        }

        public OrderHistoryItemDtoBuilder productDescription(String productDescription) {
            this.productDescription = productDescription;
            return this;
        }

        public OrderHistoryItemDtoBuilder productImageUrl(String productImageUrl) {
            this.productImageUrl = productImageUrl;
            return this;
        }

        public OrderHistoryItemDtoBuilder category(String category) {
            this.category = category;
            return this;
        }

        public OrderHistoryItemDtoBuilder quantity(Integer quantity) {
            this.quantity = quantity;
            return this;
        }

        public OrderHistoryItemDtoBuilder price(BigDecimal price) {
            this.price = price;
            return this;
        }

        public OrderHistoryItemDtoBuilder totalPrice(BigDecimal totalPrice) {
            this.totalPrice = totalPrice;
            return this;
        }

        public OrderHistoryItemDtoBuilder orderStatus(String orderStatus) {
            this.orderStatus = orderStatus;
            return this;
        }

        public OrderHistoryItemDtoBuilder orderDate(LocalDateTime orderDate) {
            this.orderDate = orderDate;
            return this;
        }

        public OrderHistoryItemDto build() {
            return new OrderHistoryItemDto(username, role, orderId, productId, productName, productDescription,
                    productImageUrl, category, quantity, price, totalPrice, orderStatus, orderDate);
        }
    }
}
