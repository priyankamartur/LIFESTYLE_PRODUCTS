package com.lifestyle.products.service;

import com.lifestyle.products.dto.CheckoutRequestDto;
import com.lifestyle.products.dto.OrderHistoryItemDto;
import com.lifestyle.products.dto.OrderItemResponseDto;
import com.lifestyle.products.dto.OrderResponseDto;
import com.lifestyle.products.dto.OrderStatusUpdateRequestDto;
import java.util.ArrayList;
import com.lifestyle.products.entity.*;
import com.lifestyle.products.exception.ApiException;
import com.lifestyle.products.repository.CartRepository;
import com.lifestyle.products.repository.OrderRepository;
import com.lifestyle.products.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public OrderResponseDto checkout(String username, CheckoutRequestDto dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException("User not found: " + username, HttpStatus.NOT_FOUND));

        Cart cart = cartRepository.findByUserUsername(username)
                .orElseThrow(() -> new ApiException("Shopping cart is empty", HttpStatus.BAD_REQUEST));

        if (cart.getCartItems().isEmpty()) {
            throw new ApiException("Cannot checkout an empty shopping cart", HttpStatus.BAD_REQUEST);
        }

        // Initialize order
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setShippingAddress(dto.getShippingAddress());

        // Process cart items to order items
        List<OrderItem> orderItems = cart.getCartItems().stream()
                .map(cartItem -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order);
                    orderItem.setProduct(cartItem.getProduct());
                    orderItem.setQuantity(cartItem.getQuantity());
                    orderItem.setPrice(cartItem.getProduct().getPrice());
                    return orderItem;
                })
                .collect(Collectors.toList());

        order.setOrderItems(orderItems);

        // Compute grand total
        BigDecimal totalAmount = orderItems.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(totalAmount);

        // Clear active cart (handled cleanly via orphanRemoval)
        cart.getCartItems().clear();
        cartRepository.save(cart);

        // Save order
        Order savedOrder = orderRepository.save(order);
        return mapToDto(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDto> getOrderHistory(String username) {
        List<Order> orders = orderRepository.findByUserUsernameOrderByOrderDateDesc(username);
        return orders.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponseDto getOrderDetails(String username, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiException("Order not found with ID: " + orderId, HttpStatus.NOT_FOUND));

        if (!order.getUser().getUsername().equals(username)) {
            throw new ApiException("Access denied: You do not own this order", HttpStatus.FORBIDDEN);
        }

        return mapToDto(order);
    }

    @Transactional
    public OrderResponseDto updateOrderStatus(Long orderId, OrderStatusUpdateRequestDto dto) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiException("Order not found with ID: " + orderId, HttpStatus.NOT_FOUND));

        try {
            OrderStatus status = OrderStatus.valueOf(dto.getStatus().toUpperCase());
            order.setStatus(status);
        } catch (IllegalArgumentException e) {
            throw new ApiException("Invalid status value: " + dto.getStatus(), HttpStatus.BAD_REQUEST);
        }

        Order updatedOrder = orderRepository.save(order);
        return mapToDto(updatedOrder);
    }

    private OrderResponseDto mapToDto(Order order) {
        List<OrderItemResponseDto> items = order.getOrderItems().stream()
                .map(item -> OrderItemResponseDto.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .productDescription(item.getProduct().getDescription())
                        .productImageUrl(item.getProduct().getImageUrl())
                        .category(item.getProduct().getCategory().getName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .totalPrice(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                        .build())
                .collect(Collectors.toList());

        return OrderResponseDto.builder()
                .id(order.getId())
                .orderDate(order.getOrderDate())
                .status(order.getStatus().name())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .items(items)
                .build();
    }

    @Transactional(readOnly = true)
    public List<OrderHistoryItemDto> getSuccessfulOrders(String username) {
        List<Order> orders = orderRepository.findSuccessfulOrdersForUser(username);
        
        List<OrderHistoryItemDto> itemsList = new ArrayList<>();
        
        for (Order order : orders) {
            String roleName = "ROLE_USER"; // default fallback
            if (order.getUser().getRoles() != null && !order.getUser().getRoles().isEmpty()) {
                roleName = order.getUser().getRoles().iterator().next().getName().name();
            }
            
            for (OrderItem item : order.getOrderItems()) {
                BigDecimal totalPrice = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                
                OrderHistoryItemDto dto = OrderHistoryItemDto.builder()
                        .username(order.getUser().getUsername())
                        .role(roleName)
                        .orderId(order.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .productDescription(item.getProduct().getDescription())
                        .productImageUrl(item.getProduct().getImageUrl())
                        .category(item.getProduct().getCategory().getName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .totalPrice(totalPrice)
                        .orderStatus(order.getStatus().name())
                        .orderDate(order.getOrderDate())
                        .build();
                
                itemsList.add(dto);
            }
        }
        
        return itemsList;
    }
}

