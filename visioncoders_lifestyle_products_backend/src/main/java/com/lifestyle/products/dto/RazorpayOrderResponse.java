package com.lifestyle.products.dto;

import java.math.BigDecimal;

public class RazorpayOrderResponse {
    private String orderId;
    private BigDecimal amount;
    private String currency;
    private String key;

    // No-args constructor
    public RazorpayOrderResponse() {
    }

    // All-args constructor
    public RazorpayOrderResponse(String orderId, BigDecimal amount, String currency, String key) {
        this.orderId = orderId;
        this.amount = amount;
        this.currency = currency;
        this.key = key;
    }

    // Getters and Setters
    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    // Builder method
    public static RazorpayOrderResponseBuilder builder() {
        return new RazorpayOrderResponseBuilder();
    }

    // Builder class
    public static class RazorpayOrderResponseBuilder {
        private String orderId;
        private BigDecimal amount;
        private String currency;
        private String key;

        public RazorpayOrderResponseBuilder orderId(String orderId) {
            this.orderId = orderId;
            return this;
        }

        public RazorpayOrderResponseBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public RazorpayOrderResponseBuilder currency(String currency) {
            this.currency = currency;
            return this;
        }

        public RazorpayOrderResponseBuilder key(String key) {
            this.key = key;
            return this;
        }

        public RazorpayOrderResponse build() {
            return new RazorpayOrderResponse(orderId, amount, currency, key);
        }
    }
}
