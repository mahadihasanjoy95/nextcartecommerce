package com.mhjoy.nextcart.product.dto.request;

import com.mhjoy.nextcart.product.enums.ProductStatus;
import com.mhjoy.nextcart.product.enums.ProductType;
import com.mhjoy.nextcart.product.validation.ValidProductPricing;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@ValidProductPricing
public class CreateProductRequestDto {

    @NotBlank(message = "Product name is required")
    @Size(max = 255, message = "Product name must not exceed 255 characters")
    private String name;

    @Size(max = 255, message = "Slug must not exceed 255 characters")
    private String slug;

    @Size(max = 1000, message = "Short description must not exceed 1000 characters")
    private String shortDescription;

    private String description;

    @NotNull(message = "Product type is required")
    private ProductType productType;

    private ProductStatus status = ProductStatus.DRAFT;

    private Long categoryId;

    private Long brandId;

    @NotNull(message = "Featured flag is required")
    private Boolean featured = false;

    @NotNull(message = "New arrival flag is required")
    private Boolean newArrival = false;

    @NotNull(message = "Track inventory flag is required")
    private Boolean trackInventory = true;

    @NotNull(message = "In stock flag is required")
    private Boolean inStock = true;

    @DecimalMin(value = "0.0", inclusive = true, message = "Base price must be greater than or equal to 0")
    private BigDecimal basePrice;

    @DecimalMin(value = "0.0", inclusive = true, message = "Sale price must be greater than or equal to 0")
    private BigDecimal salePrice;

    @NotBlank(message = "Currency is required")
    @Size(max = 10, message = "Currency must not exceed 10 characters")
    private String currency = "BDT";

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
