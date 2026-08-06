package com.lifestyle.products.dto;

import jakarta.validation.constraints.NotBlank;

public class OrderStatusUpdateRequestDto {
    @NotBlank(message = "Order status is required")
    private String status;

    public OrderStatusUpdateRequestDto() {
    }

    public OrderStatusUpdateRequestDto(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public static OrderStatusUpdateRequestDtoBuilder builder() {
        return new OrderStatusUpdateRequestDtoBuilder();
    }

    public static class OrderStatusUpdateRequestDtoBuilder {
        private String status;

        public OrderStatusUpdateRequestDtoBuilder status(String status) {
            this.status = status;
            return this;
        }

        public OrderStatusUpdateRequestDto build() {
            return new OrderStatusUpdateRequestDto(status);
        }
    }
}
