package com.lifestyle.products.dto;

public class CartActionResponseDto {
    private String message;
    private Integer count;

    public CartActionResponseDto() {
    }

    public CartActionResponseDto(String message, Integer count) {
        this.message = message;
        this.count = count;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }
}
