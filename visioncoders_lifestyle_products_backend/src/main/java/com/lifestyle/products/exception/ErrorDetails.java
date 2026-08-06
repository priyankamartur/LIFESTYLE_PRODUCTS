package com.lifestyle.products.exception;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ErrorDetails {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String details;

    public ErrorDetails() {
    }

    public ErrorDetails(LocalDateTime timestamp, int status, String error, String message, String details) {
        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.message = message;
        this.details = details;
    }
}
