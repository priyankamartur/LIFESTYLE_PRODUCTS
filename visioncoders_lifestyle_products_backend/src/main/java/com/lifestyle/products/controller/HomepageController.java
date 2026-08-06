package com.lifestyle.products.controller;

import com.lifestyle.products.dto.BannerDto;
import com.lifestyle.products.dto.CategoryDto;
import com.lifestyle.products.dto.HomepageDataDto;
import com.lifestyle.products.dto.ProductDto;
import com.lifestyle.products.service.HomepageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/home")
public class HomepageController {

    @Autowired
    private HomepageService homepageService;

    @GetMapping
    public ResponseEntity<HomepageDataDto> getHomepageData() {
        return ResponseEntity.ok(homepageService.getHomepageData());
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDto>> getCategories() {
        return ResponseEntity.ok(homepageService.getCategories());
    }

    @GetMapping("/featured")
    public ResponseEntity<List<ProductDto>> getFeaturedProducts() {
        return ResponseEntity.ok(homepageService.getFeaturedProducts());
    }

    @GetMapping("/latest")
    public ResponseEntity<List<ProductDto>> getLatestProducts() {
        return ResponseEntity.ok(homepageService.getLatestProducts());
    }

    @GetMapping("/banners")
    public ResponseEntity<List<BannerDto>> getBanners() {
        return ResponseEntity.ok(homepageService.getBanners());
    }
}
