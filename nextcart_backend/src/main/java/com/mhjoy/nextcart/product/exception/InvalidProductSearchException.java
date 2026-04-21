package com.mhjoy.nextcart.product.exception;

import com.mhjoy.nextcart.common.exception.BadRequestException;

public class InvalidProductSearchException extends BadRequestException {

    public InvalidProductSearchException(String message) {
        super("INVALID_PRODUCT_SEARCH", message);
    }
}
