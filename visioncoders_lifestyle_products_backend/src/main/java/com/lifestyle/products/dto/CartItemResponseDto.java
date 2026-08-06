package com.lifestyle.products.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemResponseDto {
    private Long id;
    private Long productId;
    private String productName;
    private BigDecimal productPrice;
    private String imageUrl;
    private Integer quantity;
    private BigDecimal totalPrice;
}
