package com.lifestyle.products.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomepageDataDto {
    private List<CategoryDto> categories;
    private List<ProductDto> featuredProducts;
    private List<ProductDto> latestProducts;
    private List<BannerDto> banners;
}
