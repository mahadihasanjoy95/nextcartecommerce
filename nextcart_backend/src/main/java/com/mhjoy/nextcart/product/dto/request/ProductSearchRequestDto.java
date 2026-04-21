package com.mhjoy.nextcart.product.dto.request;

import com.mhjoy.nextcart.product.enums.ProductSortBy;
import com.mhjoy.nextcart.product.enums.ProductStatus;
import com.mhjoy.nextcart.product.enums.ProductType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductSearchRequestDto {

    private String query;

    private Long categoryId;

    private String categorySlug;

    private Long brandId;

    private String brandSlug;

    private ProductType productType;

    private Boolean featured;

    private Boolean newArrival;

    private Boolean inStock;

    private Boolean onSale;

    private ProductStatus status;

    @DecimalMin(value = "0.0", inclusive = true, message = "Minimum price must be greater than or equal to 0")
    private BigDecimal minPrice;

    @DecimalMin(value = "0.0", inclusive = true, message = "Maximum price must be greater than or equal to 0")
    private BigDecimal maxPrice;

    private ProductSortBy sortBy = ProductSortBy.NEWEST;

    private Sort.Direction sortDir = Sort.Direction.DESC;

    @Min(value = 0, message = "Page must be greater than or equal to 0")
    private Integer page = 0;

    @Min(value = 1, message = "Size must be greater than 0")
    private Integer size = 10;
}
