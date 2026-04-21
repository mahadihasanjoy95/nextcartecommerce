package com.mhjoy.nextcart.product.exception;

public class BrandInUseException extends RuntimeException {

    public BrandInUseException(Long brandId) {
        super("Brand with id " + brandId + " cannot be deleted because it is assigned to one or more products");
    }
}
