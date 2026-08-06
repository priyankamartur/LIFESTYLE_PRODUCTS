package com.lifestyle.products.service;

import com.lifestyle.products.dto.AnalyticsDataPointDto;
import com.lifestyle.products.dto.DailyAnalyticsResponseDto;
import com.lifestyle.products.dto.OverallAnalyticsDto;
import com.lifestyle.products.exception.ApiException;
import com.lifestyle.products.repository.OrderItemRepository;
import com.lifestyle.products.repository.OrderRepository;
import com.lifestyle.products.repository.PaymentRepository;
import com.lifestyle.products.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class AdminAnalyticsService {

    private static final Logger logger = LoggerFactory.getLogger(AdminAnalyticsService.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Transactional(readOnly = true)
    public DailyAnalyticsResponseDto getDailyAnalytics(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            dateStr = LocalDate.now().toString();
        } else {
            try {
                LocalDate.parse(dateStr.trim(), DateTimeFormatter.ISO_LOCAL_DATE);
            } catch (Exception e) {
                logger.error("Invalid date format requested for daily analytics: {}", dateStr, e);
                throw new ApiException("Invalid date format. Expected YYYY-MM-DD", HttpStatus.BAD_REQUEST);
            }
        }

        logger.info("Fetching daily analytics for date: {}", dateStr);

        BigDecimal ordersRevenue = BigDecimal.ZERO;
        Long transactionCount = 0L;
        List<Object[]> summary = orderRepository.getDailyOrdersSummary(dateStr.trim());
        if (summary != null && !summary.isEmpty()) {
            Object[] row = summary.get(0);
            if (row[0] != null) transactionCount = ((Number) row[0]).longValue();
            if (row[1] != null) ordersRevenue = new BigDecimal(row[1].toString());
        }

        BigDecimal itemsRevenue = orderItemRepository.getDailyOrderItemsRevenue(dateStr.trim());
        BigDecimal paymentsRevenue = paymentRepository.getDailyPaymentsRevenue(dateStr.trim());

        BigDecimal dailyRevenue = ordersRevenue;
        if (dailyRevenue.compareTo(BigDecimal.ZERO) == 0 && paymentsRevenue != null && paymentsRevenue.compareTo(BigDecimal.ZERO) > 0) {
            dailyRevenue = paymentsRevenue;
        }
        if (dailyRevenue.compareTo(BigDecimal.ZERO) == 0 && itemsRevenue != null && itemsRevenue.compareTo(BigDecimal.ZERO) > 0) {
            dailyRevenue = itemsRevenue;
        }

        String performance = (dailyRevenue.compareTo(BigDecimal.ZERO) > 0) ? "Active Target" : "Standby";
        List<AnalyticsDataPointDto> chartData = new ArrayList<>();
        if (transactionCount > 0 || dailyRevenue.compareTo(BigDecimal.ZERO) > 0) {
            chartData = mapToDataPoints(orderRepository.getDailyRevenueNative());
        }

        DailyAnalyticsResponseDto response = new DailyAnalyticsResponseDto(dailyRevenue, transactionCount, performance, chartData);
        logger.info("Daily analytics API response for date {}: {}", dateStr, response);
        return response;
    }


    @Transactional(readOnly = true)
    public List<AnalyticsDataPointDto> getMonthlyAnalytics() {
        List<Object[]> results = orderRepository.getMonthlyRevenueNative();
        return mapToDataPoints(results);
    }

    @Transactional(readOnly = true)
    public List<AnalyticsDataPointDto> getYearlyAnalytics() {
        List<Object[]> results = orderRepository.getYearlyRevenueNative();
        return mapToDataPoints(results);
    }

    @Transactional(readOnly = true)
    public OverallAnalyticsDto getOverallAnalytics() {
        Long totalOrders = orderRepository.count();
        Long totalUsers = userRepository.count();
        BigDecimal totalRevenue = orderRepository.sumTotalRevenue();
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }
        BigDecimal averageOrderValue = BigDecimal.ZERO;
        if (totalOrders > 0) {
            averageOrderValue = totalRevenue.divide(BigDecimal.valueOf(totalOrders), 2, RoundingMode.HALF_UP);
        }
        return new OverallAnalyticsDto(totalOrders, totalUsers, totalRevenue, averageOrderValue);
    }

    private List<AnalyticsDataPointDto> mapToDataPoints(List<Object[]> results) {
        List<AnalyticsDataPointDto> dtos = new ArrayList<>();
        for (Object[] row : results) {
            String period = row[0] != null ? row[0].toString() : "";
            BigDecimal revenue = row[1] != null ? new BigDecimal(row[1].toString()) : BigDecimal.ZERO;
            dtos.add(new AnalyticsDataPointDto(period, revenue));
        }
        return dtos;
    }
}
