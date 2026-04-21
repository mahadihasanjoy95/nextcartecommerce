package com.mhjoy.nextcart.product.mapper;

import com.mhjoy.nextcart.common.config.StorageProperties;
import com.mhjoy.nextcart.product.dto.request.CreateProductRequestDto;
import com.mhjoy.nextcart.product.dto.request.UpdateProductRequestDto;
import com.mhjoy.nextcart.product.dto.response.ProductResponseDto;
import com.mhjoy.nextcart.product.entity.Product;
import com.mhjoy.nextcart.product.entity.ProductImage;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

/**
 * MapStruct mapper for the {@link Product} domain.
 *
 * <p>Abstract class (instead of interface) so that {@link StorageProperties} can be
 * injected to construct full S3 URLs from stored object keys at mapping time.</p>
 *
 * @author Mahadi Hasan Joy
 * @since 2026-04-09
 */
@Mapper(componentModel = "spring")
public abstract class ProductMapper {

    @Autowired
    protected StorageProperties storageProperties;

    /**
     * Maps a {@link CreateProductRequestDto} to a new {@link Product} entity.
     * Computed fields (slug, category, brand) are excluded and set by the service.
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "productImages", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    public abstract Product toEntity(CreateProductRequestDto dto);

    /**
     * Applies non-null fields from an {@link UpdateProductRequestDto} onto an existing product.
     * Null-valued fields are skipped.
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "productImages", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    public abstract void updateProductFromDto(UpdateProductRequestDto dto, @MappingTarget Product product);

    /**
     * Maps a {@link Product} entity to a {@link ProductResponseDto}.
     * S3 keys stored in thumbnailUrl / imageUrl fields are expanded to full URLs.
     */
    @Mapping(source = "category.id",   target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = "brand.id",      target = "brandId")
    @Mapping(source = "brand.name",    target = "brandName")
    @Mapping(target = "imageUrls",    expression = "java(toImageUrls(product.getProductImages()))")
    @Mapping(target = "thumbnailUrl", expression = "java(resolveThumbnailUrl(product))")
    public abstract ProductResponseDto toResponseDto(Product product);

    // ─────────────────────────────────────────────────────────────────────────

    protected List<String> toImageUrls(List<ProductImage> productImages) {
        if (productImages == null) {
            return List.of();
        }
        return productImages.stream()
                .map(img -> buildUrl(img.getImageUrl()))
                .toList();
    }

    protected String resolveThumbnailUrl(Product product) {
        if (product.getThumbnailUrl() != null && !product.getThumbnailUrl().isBlank()) {
            return buildUrl(product.getThumbnailUrl());
        }
        if (product.getProductImages() == null || product.getProductImages().isEmpty()) {
            return null;
        }
        return buildUrl(product.getProductImages().getFirst().getImageUrl());
    }

    /**
     * Converts an S3 key to a full URL using the configured base URL.
     * If the value is already a full URL (legacy data), it is returned as-is.
     *
     * @Named prevents MapStruct from auto-applying this as a String→String
     * type converter for every mapped field (currency, name, slug, etc.).
     */
    @Named("buildUrl")
    protected String buildUrl(String keyOrUrl) {
        if (keyOrUrl == null || keyOrUrl.isBlank()) return null;
        if (keyOrUrl.startsWith("http://") || keyOrUrl.startsWith("https://")) return keyOrUrl;
        return storageProperties.normalizedBaseUrl() + keyOrUrl;
    }
}
