package com.mhjoy.nextcart.product.exception;

import com.mhjoy.nextcart.common.exception.ConflictException;

public class CategorySlugConflictException extends ConflictException {

    public CategorySlugConflictException(String slug) {
        super("CATEGORY_SLUG_CONFLICT", "Category slug already exists: " + slug);
    }
}
