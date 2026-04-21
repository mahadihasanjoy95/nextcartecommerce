package com.mhjoy.nextcart.product.exception;

import com.mhjoy.nextcart.common.exception.ResourceNotFoundException;

/**
 * Thrown when a category cannot be found by the given identifier.
 *
 * @author Mahadi Hasan Joy
 * @since 2026-04-09
 */
public class CategoryNotFoundException extends ResourceNotFoundException {

    public CategoryNotFoundException(Long categoryId) {
        super("CATEGORY_NOT_FOUND", "Category not found with id: " + categoryId);
    }
}
