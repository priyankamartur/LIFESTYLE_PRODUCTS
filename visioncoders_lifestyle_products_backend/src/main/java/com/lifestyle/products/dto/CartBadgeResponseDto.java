package com.lifestyle.products.dto;

public class CartBadgeResponseDto {
    private Integer count;

    public CartBadgeResponseDto() {
    }

    public CartBadgeResponseDto(Integer count) {
        this.count = count;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }
}
