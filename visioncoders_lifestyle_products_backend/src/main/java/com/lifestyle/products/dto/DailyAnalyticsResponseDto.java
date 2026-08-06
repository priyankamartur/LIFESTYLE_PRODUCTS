package com.lifestyle.products.dto;

import java.math.BigDecimal;
import java.util.List;

public class DailyAnalyticsResponseDto {
    private BigDecimal dailyRevenue;
    private Long transactionCount;
    private String performance;
    private List<AnalyticsDataPointDto> chartData;

    public DailyAnalyticsResponseDto() {}

    public DailyAnalyticsResponseDto(BigDecimal dailyRevenue, Long transactionCount, String performance, List<AnalyticsDataPointDto> chartData) {
        this.dailyRevenue = dailyRevenue;
        this.transactionCount = transactionCount;
        this.performance = performance;
        this.chartData = chartData;
    }

    public BigDecimal getDailyRevenue() {
        return dailyRevenue;
    }

    public void setDailyRevenue(BigDecimal dailyRevenue) {
        this.dailyRevenue = dailyRevenue;
    }

    public Long getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(Long transactionCount) {
        this.transactionCount = transactionCount;
    }

    public String getPerformance() {
        return performance;
    }

    public void setPerformance(String performance) {
        this.performance = performance;
    }

    public List<AnalyticsDataPointDto> getChartData() {
        return chartData;
    }

    public void setChartData(List<AnalyticsDataPointDto> chartData) {
        this.chartData = chartData;
    }
}
