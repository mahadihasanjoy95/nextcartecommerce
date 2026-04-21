package com.mhjoy.nextcart.product.exception;

public class CategoryInUseException extends RuntimeException {

    public CategoryInUseException(Long categoryId) {
        super("Category with id " + categoryId + " cannot be deleted because it is assigned to one or more products");
    }
}
