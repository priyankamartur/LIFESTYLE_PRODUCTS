package com.lifestyle.products.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class UpdateQuantityRequestDto {
    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    public UpdateQuantityRequestDto() {
    }

    public UpdateQuantityRequestDto(Long productId, Integer quantity) {
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

    public static UpdateQuantityRequestDtoBuilder builder() {
        return new UpdateQuantityRequestDtoBuilder();
    }

    public static class UpdateQuantityRequestDtoBuilder {
        private Long productId;
        private Integer quantity;

        public UpdateQuantityRequestDtoBuilder productId(Long productId) {
            this.productId = productId;
            return this;
        }

        public UpdateQuantityRequestDtoBuilder quantity(Integer quantity) {
            this.quantity = quantity;
            return this;
        }

        public UpdateQuantityRequestDto build() {
            return new UpdateQuantityRequestDto(productId, quantity);
        }
    }
}
