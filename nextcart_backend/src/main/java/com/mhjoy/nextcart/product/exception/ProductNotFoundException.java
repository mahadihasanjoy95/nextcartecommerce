package com.mhjoy.nextcart.product.exception;

import com.mhjoy.nextcart.common.exception.ResourceNotFoundException;

/**
 * Thrown when a product cannot be found by the given identifier.
 *
 * @author Mahadi Hasan Joy
 * @since 2026-04-09
 */
public class ProductNotFoundException extends ResourceNotFoundException {

    public ProductNotFoundException(Long productId) {
        super("PRODUCT_NOT_FOUND", "Product not found with id: " + productId);
    }

    public ProductNotFoundException(String slug) {
        super("PRODUCT_NOT_FOUND", "Active product not found with slug: " + slug);
    }
}
