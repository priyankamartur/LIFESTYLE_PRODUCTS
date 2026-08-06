package com.lifestyle.products.controller;

import com.lifestyle.products.dto.WishlistBadgeResponseDto;
import com.lifestyle.products.dto.WishlistItemDto;
import com.lifestyle.products.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @PostMapping("/{productId}")
    public ResponseEntity<WishlistBadgeResponseDto> addProductToWishlist(
            Principal principal,
            @PathVariable(name = "productId") Long productId
    ) {
        WishlistBadgeResponseDto response = wishlistService.addProductToWishlist(principal.getName(), productId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<WishlistItemDto>> getWishlist(Principal principal) {
        List<WishlistItemDto> response = wishlistService.getWishlist(principal.getName());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<WishlistBadgeResponseDto> removeProductFromWishlist(
            Principal principal,
            @PathVariable(name = "productId") Long productId
    ) {
        WishlistBadgeResponseDto response = wishlistService.removeProductFromWishlist(principal.getName(), productId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/count")
    public ResponseEntity<WishlistBadgeResponseDto> getWishlistCount(Principal principal) {
        WishlistBadgeResponseDto response = wishlistService.getWishlistCount(principal.getName());
        return ResponseEntity.ok(response);
    }
}
