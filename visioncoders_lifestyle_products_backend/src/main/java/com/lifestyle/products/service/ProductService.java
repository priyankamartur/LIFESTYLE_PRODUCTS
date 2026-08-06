package com.lifestyle.products.service;

import com.lifestyle.products.dto.ProductImageMetadataDto;
import com.lifestyle.products.dto.PagedResponseDto;
import com.lifestyle.products.dto.ProductDto;
import com.lifestyle.products.dto.ProductRequestDto;
import com.lifestyle.products.entity.Category;
import com.lifestyle.products.entity.Product;
import com.lifestyle.products.exception.ApiException;
import com.lifestyle.products.repository.CategoryRepository;
import com.lifestyle.products.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Transactional
    public ProductDto createProduct(ProductRequestDto dto) {
        if (dto.getName() != null && productRepository.existsByNameIgnoreCase(dto.getName().trim())) {
            throw new ApiException("Duplicate Product: A product with name '" + dto.getName() + "' already exists.", HttpStatus.CONFLICT);
        }

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ApiException("Category not found with ID: " + dto.getCategoryId(), HttpStatus.NOT_FOUND));

        Product product = Product.builder()
                .name(dto.getName().trim())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .imageUrl(dto.getImageUrl())
                .featured(dto.getFeatured() != null ? dto.getFeatured() : false)
                .category(category)
                .build();

        Product savedProduct = productRepository.save(product);
        ProductDto responseDto = mapToDto(savedProduct);
        if (dto.getStockQuantity() != null) {
            responseDto.setStockQuantity(dto.getStockQuantity());
        }
        return responseDto;
    }

    @Transactional(readOnly = true)
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ApiException("Product not found with ID: " + id, HttpStatus.NOT_FOUND));
        return mapToDto(product);
    }

    @Transactional(readOnly = true)
    public PagedResponseDto<ProductDto> getAllProducts(int pageNo, int pageSize, String sortBy, String sortDir, String search, Long categoryId) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.DESC.name()) 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        
        String searchParam = (search == null || search.trim().isEmpty()) ? null : search.trim();

        Page<Product> page = productRepository.searchProducts(categoryId, searchParam, pageable);

        List<ProductDto> content = page.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return new PagedResponseDto<>(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductRequestDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ApiException("Product not found with ID: " + id, HttpStatus.NOT_FOUND));

        if (dto.getName() != null && !product.getName().equalsIgnoreCase(dto.getName().trim()) && productRepository.existsByNameIgnoreCase(dto.getName().trim())) {
            throw new ApiException("Duplicate Product: A product with name '" + dto.getName() + "' already exists.", HttpStatus.CONFLICT);
        }

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ApiException("Category not found with ID: " + dto.getCategoryId(), HttpStatus.NOT_FOUND));

        product.setName(dto.getName().trim());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setImageUrl(dto.getImageUrl());
        product.setFeatured(dto.getFeatured() != null ? dto.getFeatured() : false);
        product.setCategory(category);

        Product updatedProduct = productRepository.save(product);
        ProductDto responseDto = mapToDto(updatedProduct);
        if (dto.getStockQuantity() != null) {
            responseDto.setStockQuantity(dto.getStockQuantity());
        }
        return responseDto;
    }

    @Transactional
    public ProductDto updateProductImageMetadata(Long id, ProductImageMetadataDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ApiException("Product not found with ID: " + id, HttpStatus.NOT_FOUND));
        product.setImageUrl(dto.getImageUrl());
        Product updatedProduct = productRepository.save(product);
        return mapToDto(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ApiException("Product not found with ID: " + id, HttpStatus.NOT_FOUND));
        productRepository.delete(product);
    }

    private ProductDto mapToDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .featured(product.getFeatured())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .stockQuantity(100)
                .build();
    }
}
