package com.lifestyle.products.service;

import com.lifestyle.products.dto.WishlistBadgeResponseDto;
import com.lifestyle.products.dto.WishlistItemDto;
import com.lifestyle.products.entity.Product;
import com.lifestyle.products.entity.User;
import com.lifestyle.products.entity.Wishlist;
import com.lifestyle.products.exception.ApiException;
import com.lifestyle.products.repository.ProductRepository;
import com.lifestyle.products.repository.UserRepository;
import com.lifestyle.products.repository.WishlistRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public WishlistService(WishlistRepository wishlistRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public WishlistBadgeResponseDto addProductToWishlist(String username, Long productId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ApiException("Product not found", HttpStatus.NOT_FOUND));

        if (wishlistRepository.existsByUserUsernameAndProductId(username, productId)) {
            throw new ApiException("Product already in wishlist", HttpStatus.BAD_REQUEST);
        }

        Wishlist wishlist = new Wishlist(user, product);
        wishlistRepository.save(wishlist);

        long count = wishlistRepository.countByUserUsername(username);
        return new WishlistBadgeResponseDto((int) count);
    }

    @Transactional(readOnly = true)
    public List<WishlistItemDto> getWishlist(String username) {
        if (!userRepository.existsByUsername(username)) {
            throw new ApiException("User not found", HttpStatus.NOT_FOUND);
        }

        List<Wishlist> wishlistItems = wishlistRepository.findByUserUsernameOrderByCreatedAtDesc(username);

        return wishlistItems.stream().map(item -> {
            Product product = item.getProduct();
            WishlistItemDto dto = new WishlistItemDto();
            dto.setId(item.getId());
            dto.setProductId(product.getId());
            dto.setProductName(product.getName());
            dto.setDescription(product.getDescription());
            dto.setCategory(product.getCategory() != null ? product.getCategory().getName() : "Lifestyle");
            dto.setPrice(product.getPrice());
            dto.setDiscount(BigDecimal.ZERO); // default discount
            dto.setProductImageUrl(product.getImageUrl());
            dto.setStockStatus("In Stock"); // default stock status
            dto.setCreatedAt(item.getCreatedAt());
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public WishlistBadgeResponseDto removeProductFromWishlist(String username, Long productId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        Wishlist wishlist = wishlistRepository.findByUserUsernameAndProductId(username, productId)
                .orElseThrow(() -> new ApiException("Product not in wishlist", HttpStatus.NOT_FOUND));

        wishlistRepository.delete(wishlist);

        long count = wishlistRepository.countByUserUsername(username);
        return new WishlistBadgeResponseDto((int) count);
    }

    @Transactional(readOnly = true)
    public WishlistBadgeResponseDto getWishlistCount(String username) {
        if (!userRepository.existsByUsername(username)) {
            throw new ApiException("User not found", HttpStatus.NOT_FOUND);
        }
        long count = wishlistRepository.countByUserUsername(username);
        return new WishlistBadgeResponseDto((int) count);
    }
}
