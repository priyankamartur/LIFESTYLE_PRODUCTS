package com.lifestyle.products.controller;

import com.lifestyle.products.dto.AnalyticsDataPointDto;
import com.lifestyle.products.dto.OverallAnalyticsDto;
import com.lifestyle.products.service.AdminAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/analytics")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAnalyticsController {

    @Autowired
    private AdminAnalyticsService adminAnalyticsService;

    @GetMapping("/daily")
    public ResponseEntity<com.lifestyle.products.dto.DailyAnalyticsResponseDto> getDailyAnalytics(
            @org.springframework.web.bind.annotation.RequestParam(value = "date", required = false) String date,
            jakarta.servlet.http.HttpServletRequest request) {
        org.slf4j.LoggerFactory.getLogger(AdminAnalyticsController.class)
                .info("Request URL: {}, Request date: {}", request.getRequestURL(), date);
        return ResponseEntity.ok(adminAnalyticsService.getDailyAnalytics(date));
    }
    @GetMapping("/monthly")
    public ResponseEntity<List<AnalyticsDataPointDto>> getMonthlyAnalytics() {
        return ResponseEntity.ok(adminAnalyticsService.getMonthlyAnalytics());
    }

    @GetMapping("/yearly")
    public ResponseEntity<List<AnalyticsDataPointDto>> getYearlyAnalytics() {
        return ResponseEntity.ok(adminAnalyticsService.getYearlyAnalytics());
    }

    @GetMapping("/overall")
    public ResponseEntity<OverallAnalyticsDto> getOverallAnalytics() {
        return ResponseEntity.ok(adminAnalyticsService.getOverallAnalytics());
    }
}
