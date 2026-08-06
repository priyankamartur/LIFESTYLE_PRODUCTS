package com.lifestyle.products.dto;

public class ForgotPasswordResponse {
    private String message;
    private String token; // Included for local simulation testing without SMTP

    public ForgotPasswordResponse() {}

    public ForgotPasswordResponse(String message, String token) {
        this.message = message;
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
