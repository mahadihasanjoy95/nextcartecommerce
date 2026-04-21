package com.mhjoy.nextcart.product.dto.response;

import com.mhjoy.nextcart.product.enums.ProductStatus;
import com.mhjoy.nextcart.product.enums.ProductType;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ProductResponseDto {

    private Long id;
    private String name;
    private String slug;
    private String shortDescription;
    private String description;
    private ProductType productType;
    private ProductStatus status;

    private Long categoryId;
    private String categoryName;

    private Long brandId;
    private String brandName;

    private boolean featured;
    private boolean newArrival;
    private boolean trackInventory;
    private boolean inStock;

    private BigDecimal basePrice;
    private BigDecimal salePrice;
    private String currency;

    private String thumbnailUrl;
    private List<String> imageUrls;
    private String metaTitle;
    private String metaDescription;
    private LocalDateTime publishedAt;
    private Instant createdAt;
    private Instant updatedAt;
}
