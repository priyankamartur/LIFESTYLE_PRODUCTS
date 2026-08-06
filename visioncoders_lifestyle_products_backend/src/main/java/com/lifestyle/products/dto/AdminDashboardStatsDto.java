package com.lifestyle.products.dto;

import java.math.BigDecimal;
import java.util.List;

public class AdminDashboardStatsDto {
    private Long totalUsers;
    private Long totalOrders;
    private BigDecimal totalRevenue;
    private List<OrderResponseDto> recentOrders;
    private List<UserProfileResponseDto> recentUsers;

    // No-args constructor
    public AdminDashboardStatsDto() {
    }

    // All-args constructor
    public AdminDashboardStatsDto(Long totalUsers, Long totalOrders, BigDecimal totalRevenue,
                                  List<OrderResponseDto> recentOrders, List<UserProfileResponseDto> recentUsers) {
        this.totalUsers = totalUsers;
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.recentOrders = recentOrders;
        this.recentUsers = recentUsers;
    }

    // Getters and Setters
    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public List<OrderResponseDto> getRecentOrders() {
        return recentOrders;
    }

    public void setRecentOrders(List<OrderResponseDto> recentOrders) {
        this.recentOrders = recentOrders;
    }

    public List<UserProfileResponseDto> getRecentUsers() {
        return recentUsers;
    }

    public void setRecentUsers(List<UserProfileResponseDto> recentUsers) {
        this.recentUsers = recentUsers;
    }

    // Builder method
    public static AdminDashboardStatsDtoBuilder builder() {
        return new AdminDashboardStatsDtoBuilder();
    }

    // Builder class
    public static class AdminDashboardStatsDtoBuilder {
        private Long totalUsers;
        private Long totalOrders;
        private BigDecimal totalRevenue;
        private List<OrderResponseDto> recentOrders;
        private List<UserProfileResponseDto> recentUsers;

        public AdminDashboardStatsDtoBuilder totalUsers(Long totalUsers) {
            this.totalUsers = totalUsers;
            return this;
        }

        public AdminDashboardStatsDtoBuilder totalOrders(Long totalOrders) {
            this.totalOrders = totalOrders;
            return this;
        }

        public AdminDashboardStatsDtoBuilder totalRevenue(BigDecimal totalRevenue) {
            this.totalRevenue = totalRevenue;
            return this;
        }

        public AdminDashboardStatsDtoBuilder recentOrders(List<OrderResponseDto> recentOrders) {
            this.recentOrders = recentOrders;
            return this;
        }

        public AdminDashboardStatsDtoBuilder recentUsers(List<UserProfileResponseDto> recentUsers) {
            this.recentUsers = recentUsers;
            return this;
        }

        public AdminDashboardStatsDto build() {
            return new AdminDashboardStatsDto(totalUsers, totalOrders, totalRevenue, recentOrders, recentUsers);
        }
    }
}
