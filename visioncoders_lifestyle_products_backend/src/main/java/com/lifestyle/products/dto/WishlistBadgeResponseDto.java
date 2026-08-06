package com.lifestyle.products.dto;

public class WishlistBadgeResponseDto {
    private Integer count;

    public WishlistBadgeResponseDto() {
    }

    public WishlistBadgeResponseDto(Integer count) {
        this.count = count;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }
}
