package com.lifestyle.products.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CheckoutRequestDto {
    @NotBlank(message = "Shipping address is required")
    @Size(max = 500, message = "Shipping address cannot exceed 500 characters")
    private String shippingAddress;
    
    // No-args constructor
    public CheckoutRequestDto() {
    }

    // All-args constructor
    public CheckoutRequestDto(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    // Getter and Setter
    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    // Builder method
    public static CheckoutRequestDtoBuilder builder() {
        return new CheckoutRequestDtoBuilder();
    }

    // Builder class
    public static class CheckoutRequestDtoBuilder {
        private String shippingAddress;

        public CheckoutRequestDtoBuilder shippingAddress(String shippingAddress) {
            this.shippingAddress = shippingAddress;
            return this;
        }

        public CheckoutRequestDto build() {
            return new CheckoutRequestDto(shippingAddress);
        }
    }
}
