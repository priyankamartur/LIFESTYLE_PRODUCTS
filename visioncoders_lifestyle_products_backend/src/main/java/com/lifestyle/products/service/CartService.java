package com.lifestyle.products.service;

import com.lifestyle.products.dto.CartItemRequestDto;
import com.lifestyle.products.dto.CartDetailsResponseDto;
import com.lifestyle.products.dto.CartProductResponseDto;
import com.lifestyle.products.dto.CartBadgeResponseDto;
import com.lifestyle.products.dto.UpdateQuantityRequestDto;
import com.lifestyle.products.entity.Cart;
import com.lifestyle.products.entity.CartItem;
import com.lifestyle.products.entity.Product;
import com.lifestyle.products.entity.User;
import com.lifestyle.products.exception.ApiException;
import com.lifestyle.products.repository.CartItemRepository;
import com.lifestyle.products.repository.CartRepository;
import com.lifestyle.products.repository.ProductRepository;
import com.lifestyle.products.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    // Constructor Injection
    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            UserRepository userRepository,
            ProductRepository productRepository
    ) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    // Mock stock resolver helper
    private int getProductStock(Long productId) {
        if (productId == 1L) return 5;
        if (productId == 2L) return 3;
        if (productId == 3L) return 8;
        if (productId == 4L) return 6;
        if (productId == 5L) return 4;
        return 10; // Default limit for other products
    }

    private int calculateBadgeCount(Cart cart) {
        if (cart == null || cart.getCartItems() == null) {
            return 0;
        }
        return cart.getCartItems().stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
    }

    @Transactional(readOnly = true)
    public CartBadgeResponseDto getBadgeCount(String username) {
        Cart cart = getCartEntityByUsername(username);
        return new CartBadgeResponseDto(calculateBadgeCount(cart));
    }

    @Transactional(readOnly = true)
    public CartDetailsResponseDto getCartDetails(String username) {
        Cart cart = getCartEntityByUsername(username);
        
        List<CartProductResponseDto> products = cart.getCartItems().stream()
                .map(item -> {
                    BigDecimal price = item.getProduct().getPrice();
                    BigDecimal itemTotal = price.multiply(BigDecimal.valueOf(item.getQuantity()));
                    return CartProductResponseDto.builder()
                            .productId(item.getProduct().getId())
                            .name(item.getProduct().getName())
                            .description(item.getProduct().getDescription())
                            .imageUrl(item.getProduct().getImageUrl())
                            .pricePerUnit(price)
                            .quantity(item.getQuantity())
                            .totalPrice(itemTotal)
                            .build();
                })
                .collect(Collectors.toList());

        BigDecimal overallTotalPrice = products.stream()
                .map(CartProductResponseDto::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartDetailsResponseDto.builder()
                .overallTotalPrice(overallTotalPrice)
                .products(products)
                .build();
    }

    @Transactional
    public CartBadgeResponseDto addProductToCart(String username, CartItemRequestDto dto) {
        Cart cart = getCartEntityByUsername(username);
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ApiException("Product not found with ID: " + dto.getProductId(), HttpStatus.NOT_FOUND));

        Optional<CartItem> existingItemOpt = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();

        int targetQuantity;
        int quantityToAdd = (dto.getQuantity() != null) ? dto.getQuantity() : 1;

        if (existingItemOpt.isPresent()) {
            targetQuantity = existingItemOpt.get().getQuantity() + 1;
        } else {
            targetQuantity = quantityToAdd;
        }

        // Validate stock
        int stock = getProductStock(product.getId());
        if (targetQuantity > stock) {
            throw new ApiException("Stock limit exceeded. Only " + stock + " products are available.", HttpStatus.BAD_REQUEST);
        }

        if (existingItemOpt.isPresent()) {
            existingItemOpt.get().setQuantity(targetQuantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(targetQuantity);
            cart.getCartItems().add(newItem);
        }

        Cart savedCart = cartRepository.save(cart);
        return new CartBadgeResponseDto(calculateBadgeCount(savedCart));
    }

    @Transactional
    public CartBadgeResponseDto updateItemQuantity(String username, UpdateQuantityRequestDto dto) {
        Cart cart = getCartEntityByUsername(username);

        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(dto.getProductId()))
                .findFirst()
                .orElseThrow(() -> new ApiException("Product not found in cart", HttpStatus.NOT_FOUND));

        int targetQuantity = dto.getQuantity();

        if (targetQuantity < 0) {
            throw new ApiException("Quantity cannot be negative", HttpStatus.BAD_REQUEST);
        }

        if (targetQuantity == 0) {
            cart.getCartItems().remove(cartItem);
        } else {
            int currentQuantity = cartItem.getQuantity();
            // Validate stock only if increasing quantity
            if (targetQuantity > currentQuantity) {
                int stock = getProductStock(dto.getProductId());
                if (targetQuantity > stock) {
                    throw new ApiException("Stock limit exceeded. Only " + stock + " products are available.", HttpStatus.BAD_REQUEST);
                }
            }
            cartItem.setQuantity(targetQuantity);
        }

        Cart savedCart = cartRepository.save(cart);
        return new CartBadgeResponseDto(calculateBadgeCount(savedCart));
    }

    @Transactional
    public CartBadgeResponseDto deleteProductFromCart(String username, Long productId) {
        Cart cart = getCartEntityByUsername(username);

        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new ApiException("Product not found in cart", HttpStatus.NOT_FOUND));

        cart.getCartItems().remove(cartItem);
        Cart savedCart = cartRepository.save(cart);
        return new CartBadgeResponseDto(calculateBadgeCount(savedCart));
    }

    // Keep helper method
    private Cart getCartEntityByUsername(String username) {
        return cartRepository.findByUserUsername(username)
                .orElseGet(() -> {
                    User user = userRepository.findByUsername(username)
                            .orElseThrow(() -> new ApiException("User not found: " + username, HttpStatus.NOT_FOUND));
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return newCart;
                });
    }
}
