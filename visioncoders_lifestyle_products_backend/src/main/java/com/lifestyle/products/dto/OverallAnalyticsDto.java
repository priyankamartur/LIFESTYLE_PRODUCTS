package com.lifestyle.products.dto;

import java.math.BigDecimal;

public class OverallAnalyticsDto {
    private Long totalOrders;
    private Long totalUsers;
    private BigDecimal totalRevenue;
    private BigDecimal averageOrderValue;

    public OverallAnalyticsDto() {}

    public OverallAnalyticsDto(Long totalOrders, Long totalUsers, BigDecimal totalRevenue, BigDecimal averageOrderValue) {
        this.totalOrders = totalOrders;
        this.totalUsers = totalUsers;
        this.totalRevenue = totalRevenue;
        this.averageOrderValue = averageOrderValue;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public BigDecimal getAverageOrderValue() {
        return averageOrderValue;
    }

    public void setAverageOrderValue(BigDecimal averageOrderValue) {
        this.averageOrderValue = averageOrderValue;
    }
}
