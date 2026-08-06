package com.lifestyle.products.dto;

import java.math.BigDecimal;
import java.util.List;
public class CartDetailsResponseDto {
    private BigDecimal overallTotalPrice;
    private List<CartProductResponseDto> products;

    public CartDetailsResponseDto() {
    }

    public CartDetailsResponseDto(BigDecimal overallTotalPrice, List<CartProductResponseDto> products) {
        this.overallTotalPrice = overallTotalPrice;
        this.products = products;
    }

    public BigDecimal getOverallTotalPrice() {
        return overallTotalPrice;
    }

    public void setOverallTotalPrice(BigDecimal overallTotalPrice) {
        this.overallTotalPrice = overallTotalPrice;
    }

    public List<CartProductResponseDto> getProducts() {
        return products;
    }

    public void setProducts(List<CartProductResponseDto> products) {
        this.products = products;
    }

    public static CartDetailsResponseDtoBuilder builder() {
        return new CartDetailsResponseDtoBuilder();
    }

    public static class CartDetailsResponseDtoBuilder {
        private BigDecimal overallTotalPrice;
        private List<CartProductResponseDto> products;

        public CartDetailsResponseDtoBuilder overallTotalPrice(BigDecimal overallTotalPrice) {
            this.overallTotalPrice = overallTotalPrice;
            return this;
        }

        public CartDetailsResponseDtoBuilder products(List<CartProductResponseDto> products) {
            this.products = products;
            return this;
        }

        public CartDetailsResponseDto build() {
            return new CartDetailsResponseDto(overallTotalPrice, products);
        }
    }
}
