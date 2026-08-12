package com.lifestyle.products.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderResponseDto {
    private Long id;
    private LocalDateTime orderDate;
    private String status;
    private BigDecimal totalAmount;
    private String shippingAddress;
    private String username;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private List<OrderItemResponseDto> items;

    // No-args constructor
    public OrderResponseDto() {
    }

    // All-args constructor
    public OrderResponseDto(Long id, LocalDateTime orderDate, String status, BigDecimal totalAmount, String shippingAddress, String username, String customerName, String customerEmail, String customerPhone, List<OrderItemResponseDto> items) {
        this.id = id;
        this.orderDate = orderDate;
        this.status = status;
        this.totalAmount = totalAmount;
        this.shippingAddress = shippingAddress;
        this.username = username;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.customerPhone = customerPhone;
        this.items = items;
    }

    public OrderResponseDto(Long id, LocalDateTime orderDate, String status, BigDecimal totalAmount, String shippingAddress, List<OrderItemResponseDto> items) {
        this(id, orderDate, status, totalAmount, shippingAddress, null, null, null, null, items);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public List<OrderItemResponseDto> getItems() {
        return items;
    }

    public void setItems(List<OrderItemResponseDto> items) {
        this.items = items;
    }

    // Builder method
    public static OrderResponseDtoBuilder builder() {
        return new OrderResponseDtoBuilder();
    }

    // Builder class
    public static class OrderResponseDtoBuilder {
        private Long id;
        private LocalDateTime orderDate;
        private String status;
        private BigDecimal totalAmount;
        private String shippingAddress;
        private String username;
        private String customerName;
        private String customerEmail;
        private String customerPhone;
        private List<OrderItemResponseDto> items;

        public OrderResponseDtoBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public OrderResponseDtoBuilder orderDate(LocalDateTime orderDate) {
            this.orderDate = orderDate;
            return this;
        }

        public OrderResponseDtoBuilder status(String status) {
            this.status = status;
            return this;
        }

        public OrderResponseDtoBuilder totalAmount(BigDecimal totalAmount) {
            this.totalAmount = totalAmount;
            return this;
        }

        public OrderResponseDtoBuilder shippingAddress(String shippingAddress) {
            this.shippingAddress = shippingAddress;
            return this;
        }

        public OrderResponseDtoBuilder username(String username) {
            this.username = username;
            return this;
        }

        public OrderResponseDtoBuilder customerName(String customerName) {
            this.customerName = customerName;
            return this;
        }

        public OrderResponseDtoBuilder customerEmail(String customerEmail) {
            this.customerEmail = customerEmail;
            return this;
        }

        public OrderResponseDtoBuilder customerPhone(String customerPhone) {
            this.customerPhone = customerPhone;
            return this;
        }

        public OrderResponseDtoBuilder items(List<OrderItemResponseDto> items) {
            this.items = items;
            return this;
        }

        public OrderResponseDto build() {
            return new OrderResponseDto(id, orderDate, status, totalAmount, shippingAddress, username, customerName, customerEmail, customerPhone, items);
        }
    }
}
