package com.lifestyle.products.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CartItemRequestDto {
    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    public CartItemRequestDto() {
    }

    public CartItemRequestDto(Long productId, Integer quantity) {
        this.productId = productId;
        this.quantity = quantity;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public static CartItemRequestDtoBuilder builder() {
        return new CartItemRequestDtoBuilder();
    }

    public static class CartItemRequestDtoBuilder {
        private Long productId;
        private Integer quantity;

        public CartItemRequestDtoBuilder productId(Long productId) {
            this.productId = productId;
            return this;
        }

        public CartItemRequestDtoBuilder quantity(Integer quantity) {
            this.quantity = quantity;
            return this;
        }

        public CartItemRequestDto build() {
            return new CartItemRequestDto(productId, quantity);
        }
    }
}
