package com.lifestyle.products.controller;

import com.lifestyle.products.dto.CartItemRequestDto;
import com.lifestyle.products.dto.CartDetailsResponseDto;
import com.lifestyle.products.dto.CartBadgeResponseDto;
import com.lifestyle.products.dto.CartActionResponseDto;
import com.lifestyle.products.dto.UpdateQuantityRequestDto;
import com.lifestyle.products.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    // Constructor Injection
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add")
    public ResponseEntity<CartBadgeResponseDto> addProductToCart(
            Principal principal,
            @Valid @RequestBody CartItemRequestDto dto
    ) {
        CartBadgeResponseDto response = cartService.addProductToCart(principal.getName(), dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/items/count")
    public ResponseEntity<CartBadgeResponseDto> getCartBadgeCount(Principal principal) {
        CartBadgeResponseDto response = cartService.getBadgeCount(principal.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/items")
    public ResponseEntity<CartDetailsResponseDto> getCartDetails(Principal principal) {
        CartDetailsResponseDto response = cartService.getCartDetails(principal.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update")
    public ResponseEntity<CartBadgeResponseDto> updateProductQuantity(
            Principal principal,
            @Valid @RequestBody UpdateQuantityRequestDto dto
    ) {
        CartBadgeResponseDto response = cartService.updateItemQuantity(principal.getName(), dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{productId}")
    public ResponseEntity<CartActionResponseDto> deleteProductFromCart(
            Principal principal,
            @PathVariable(name = "productId") Long productId
    ) {
        CartBadgeResponseDto badgeResponse = cartService.deleteProductFromCart(principal.getName(), productId);
        CartActionResponseDto response = new CartActionResponseDto("Product removed successfully", badgeResponse.getCount());
        return ResponseEntity.ok(response);
    }
}
