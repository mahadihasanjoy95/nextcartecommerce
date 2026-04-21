package com.mhjoy.nextcart.product.dto.request;

import com.mhjoy.nextcart.product.enums.ProductStatus;
import com.mhjoy.nextcart.product.enums.ProductType;
import com.mhjoy.nextcart.product.validation.ValidProductPricing;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@ValidProductPricing
public class UpdateProductRequestDto {

    @Size(max = 255, message = "Product name must not exceed 255 characters")
    private String name;

    @Size(max = 255, message = "Slug must not exceed 255 characters")
    private String slug;

    @Size(max = 1000, message = "Short description must not exceed 1000 characters")
    private String shortDescription;

    private String description;

    private ProductType productType;

    private ProductStatus status;

    private Long categoryId;

    private Long brandId;

    private Boolean featured;

    private Boolean newArrival;

    private Boolean trackInventory;

    private Boolean inStock;

    @DecimalMin(value = "0.0", inclusive = true, message = "Base price must be greater than or equal to 0")
    private BigDecimal basePrice;

    @DecimalMin(value = "0.0", inclusive = true, message = "Sale price must be greater than or equal to 0")
    private BigDecimal salePrice;

    @Size(max = 10, message = "Currency must not exceed 10 characters")
    private String currency;

    @Size(max = 1000, message = "Thumbnail URL must not exceed 1000 characters")
    private String thumbnailUrl;

    @Size(max = 20, message = "A product can have at most 20 images")
    private List<
            @NotBlank(message = "Image URL must not be blank")
            @Size(max = 1000, message = "Image URL must not exceed 1000 characters")
            String> imageUrls;

    @Size(max = 255, message = "Meta title must not exceed 255 characters")
    private String metaTitle;

    @Size(max = 500, message = "Meta description must not exceed 500 characters")
    private String metaDescription;

    private LocalDateTime publishedAt;
}
