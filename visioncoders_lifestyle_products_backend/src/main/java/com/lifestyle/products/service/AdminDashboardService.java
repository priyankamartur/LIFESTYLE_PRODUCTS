package com.lifestyle.products.service;

import com.lifestyle.products.dto.AdminDashboardStatsDto;
import com.lifestyle.products.dto.OrderItemResponseDto;
import com.lifestyle.products.dto.OrderResponseDto;
import com.lifestyle.products.dto.UserProfileResponseDto;
import com.lifestyle.products.entity.Order;
import com.lifestyle.products.entity.User;
import com.lifestyle.products.repository.OrderRepository;
import com.lifestyle.products.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminDashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public AdminDashboardStatsDto getDashboardStats() {
        Long totalUsers = userRepository.count();
        Long totalOrders = orderRepository.count();
        BigDecimal totalRevenue = orderRepository.sumTotalRevenue();

        // Fetch top 5 recent users
        List<User> recentUsersEntity = userRepository.findAll(
                PageRequest.of(0, 5, Sort.by("id").descending())
        ).getContent();

        List<UserProfileResponseDto> recentUsers = recentUsersEntity.stream()
                .map(this::mapToUserDto)
                .collect(Collectors.toList());

        // Fetch top 5 recent orders
        List<Order> recentOrdersEntity = orderRepository.findAll(
                PageRequest.of(0, 5, Sort.by("orderDate").descending())
        ).getContent();

        List<OrderResponseDto> recentOrders = recentOrdersEntity.stream()
                .map(this::mapToOrderDto)
                .collect(Collectors.toList());

        return AdminDashboardStatsDto.builder()
                .totalUsers(totalUsers)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .recentUsers(recentUsers)
                .recentOrders(recentOrders)
                .build();
    }

    private UserProfileResponseDto mapToUserDto(User user) {
        return UserProfileResponseDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .roles(user.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toList()))
                .build();
    }

    private OrderResponseDto mapToOrderDto(Order order) {
        List<OrderItemResponseDto> items = order.getOrderItems().stream()
                .map(item -> OrderItemResponseDto.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
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
}
