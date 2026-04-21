package com.mhjoy.nextcart.product.exception;

import com.mhjoy.nextcart.common.exception.ConflictException;

/**
 * Thrown when a product slug already exists in the system.
 *
 * @author Mahadi Hasan Joy
 * @since 2026-04-09
 */
public class ProductSlugConflictException extends ConflictException {

    public ProductSlugConflictException(String slug) {
        super("PRODUCT_SLUG_CONFLICT", "Product slug already exists: " + slug);
    }
}
