package com.lifestyle.products.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentResponseDto {
    private Long id;
    private Long orderId;
    private String transactionId;
    private BigDecimal amount;
    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime paymentDate;
    private String message;

    // No-args constructor
    public PaymentResponseDto() {
    }

    // All-args constructor
    public PaymentResponseDto(Long id, Long orderId, String transactionId, BigDecimal amount, String paymentMethod, String paymentStatus, LocalDateTime paymentDate, String message) {
        this.id = id;
        this.orderId = orderId;
        this.transactionId = transactionId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.paymentDate = paymentDate;
        this.message = message;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    // Builder method
    public static PaymentResponseDtoBuilder builder() {
        return new PaymentResponseDtoBuilder();
    }

    // Builder class
    public static class PaymentResponseDtoBuilder {
        private Long id;
        private Long orderId;
        private String transactionId;
        private BigDecimal amount;
        private String paymentMethod;
        private String paymentStatus;
        private LocalDateTime paymentDate;
        private String message;

        public PaymentResponseDtoBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public PaymentResponseDtoBuilder orderId(Long orderId) {
            this.orderId = orderId;
            return this;
        }

        public PaymentResponseDtoBuilder transactionId(String transactionId) {
            this.transactionId = transactionId;
            return this;
        }

        public PaymentResponseDtoBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public PaymentResponseDtoBuilder paymentMethod(String paymentMethod) {
            this.paymentMethod = paymentMethod;
            return this;
        }

        public PaymentResponseDtoBuilder paymentStatus(String paymentStatus) {
            this.paymentStatus = paymentStatus;
            return this;
        }

        public PaymentResponseDtoBuilder paymentDate(LocalDateTime paymentDate) {
            this.paymentDate = paymentDate;
            return this;
        }

        public PaymentResponseDtoBuilder message(String message) {
            this.message = message;
            return this;
        }

        public PaymentResponseDto build() {
            return new PaymentResponseDto(id, orderId, transactionId, amount, paymentMethod, paymentStatus, paymentDate, message);
        }
    }
}

