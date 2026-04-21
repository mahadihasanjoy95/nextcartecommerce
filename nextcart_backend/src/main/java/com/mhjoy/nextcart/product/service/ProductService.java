package com.mhjoy.nextcart.product.service;

import com.mhjoy.nextcart.product.dto.request.CreateProductRequestDto;
import com.mhjoy.nextcart.product.dto.request.ProductSearchRequestDto;
import com.mhjoy.nextcart.product.dto.request.UpdateProductRequestDto;
import com.mhjoy.nextcart.product.dto.response.ProductResponseDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {

    ProductResponseDto createProduct(CreateProductRequestDto requestDto);

    ProductResponseDto updateProduct(Long productId, UpdateProductRequestDto requestDto);

    void deleteProduct(Long productId);

    ProductResponseDto getActiveProductById(Long productId);

    ProductResponseDto getAdminProductById(Long productId);

    ProductResponseDto getActiveProductBySlug(String slug);

    Page<ProductResponseDto> searchActiveProducts(ProductSearchRequestDto requestDto);

    Page<ProductResponseDto> searchProductsForAdmin(ProductSearchRequestDto requestDto);

    /**
     * Replaces the product's thumbnail with the given S3 key.
     */
    ProductResponseDto updateThumbnailKey(Long productId, String thumbnailKey);

    /**
     * Replaces all gallery images of a product with the given S3 keys.
     */
    ProductResponseDto replaceGalleryKeys(Long productId, List<String> imageKeys);

    /**
     * Removes the product's thumbnail: deletes the S3 object and clears the thumbnailUrl field.
     */
    ProductResponseDto removeThumbnail(Long productId);

    /**
     * Removes all gallery images: deletes S3 objects and clears the productImages collection.
     */
    ProductResponseDto removeGallery(Long productId);
}
