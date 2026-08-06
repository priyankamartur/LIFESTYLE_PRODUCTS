package com.lifestyle.products.service;

import com.lifestyle.products.dto.BannerDto;
import com.lifestyle.products.dto.CategoryDto;
import com.lifestyle.products.dto.HomepageDataDto;
import com.lifestyle.products.dto.ProductDto;
import com.lifestyle.products.entity.Banner;
import com.lifestyle.products.entity.Category;
import com.lifestyle.products.entity.Product;
import com.lifestyle.products.repository.BannerRepository;
import com.lifestyle.products.repository.CategoryRepository;
import com.lifestyle.products.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HomepageService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BannerRepository bannerRepository;

    @Transactional(readOnly = true)
    public List<CategoryDto> getCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToCategoryDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getFeaturedProducts() {
        return productRepository.findByFeaturedTrue().stream()
                .map(this::mapToProductDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getLatestProducts() {
        return productRepository.findTop8ByOrderByCreatedAtDesc().stream()
                .map(this::mapToProductDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BannerDto> getBanners() {
        return bannerRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(this::mapToBannerDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public HomepageDataDto getHomepageData() {
        return HomepageDataDto.builder()
                .categories(getCategories())
                .featuredProducts(getFeaturedProducts())
                .latestProducts(getLatestProducts())
                .banners(getBanners())
                .build();
    }

    private CategoryDto mapToCategoryDto(Category category) {
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .build();
    }

    private ProductDto mapToProductDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .featured(product.getFeatured())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .build();
    }

    private BannerDto mapToBannerDto(Banner banner) {
        return BannerDto.builder()
                .id(banner.getId())
                .title(banner.getTitle())
                .imageUrl(banner.getImageUrl())
                .linkUrl(banner.getLinkUrl())
                .displayOrder(banner.getDisplayOrder())
                .build();
    }
}
