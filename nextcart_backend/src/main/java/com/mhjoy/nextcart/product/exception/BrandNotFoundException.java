package com.mhjoy.nextcart.product.exception;

import com.mhjoy.nextcart.common.exception.ResourceNotFoundException;

/**
 * Thrown when a brand cannot be found by the given identifier.
 *
 * @author Mahadi Hasan Joy
 * @since 2026-04-09
 */
public class BrandNotFoundException extends ResourceNotFoundException {

    public BrandNotFoundException(Long brandId) {
        super("BRAND_NOT_FOUND", "Brand not found with id: " + brandId);
    }
}
