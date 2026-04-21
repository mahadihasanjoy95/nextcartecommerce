package com.mhjoy.nextcart.product.exception;

import com.mhjoy.nextcart.common.exception.ConflictException;

public class BrandSlugConflictException extends ConflictException {

    public BrandSlugConflictException(String slug) {
        super("BRAND_SLUG_CONFLICT", "Brand slug already exists: " + slug);
    }
}
