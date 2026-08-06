package com.lifestyle.products.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PaymentRequestDto {
    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    private String cardNumber;
    private String cvv;
    
    private String simulateStatus = "SUCCESS";

    // No-args constructor
    public PaymentRequestDto() {
    }

    // All-args constructor
    public PaymentRequestDto(Long orderId, String paymentMethod, String cardNumber, String cvv, String simulateStatus) {
        this.orderId = orderId;
        this.paymentMethod = paymentMethod;
        this.cardNumber = cardNumber;
        this.cvv = cvv;
        this.simulateStatus = simulateStatus;
    }

    // Getters and Setters
    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getCvv() {
        return cvv;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }

    public String getSimulateStatus() {
        return simulateStatus;
    }

    public void setSimulateStatus(String simulateStatus) {
        this.simulateStatus = simulateStatus;
    }

    // Builder method
    public static PaymentRequestDtoBuilder builder() {
        return new PaymentRequestDtoBuilder();
    }

    // Builder class
    public static class PaymentRequestDtoBuilder {
        private Long orderId;
        private String paymentMethod;
        private String cardNumber;
        private String cvv;
        private String simulateStatus = "SUCCESS";

        public PaymentRequestDtoBuilder orderId(Long orderId) {
            this.orderId = orderId;
            return this;
        }

        public PaymentRequestDtoBuilder paymentMethod(String paymentMethod) {
            this.paymentMethod = paymentMethod;
            return this;
        }

        public PaymentRequestDtoBuilder cardNumber(String cardNumber) {
            this.cardNumber = cardNumber;
            return this;
        }

        public PaymentRequestDtoBuilder cvv(String cvv) {
            this.cvv = cvv;
            return this;
        }

        public PaymentRequestDtoBuilder simulateStatus(String simulateStatus) {
            this.simulateStatus = simulateStatus;
            return this;
        }

        public PaymentRequestDto build() {
            return new PaymentRequestDto(orderId, paymentMethod, cardNumber, cvv, simulateStatus);
        }
    }
}
