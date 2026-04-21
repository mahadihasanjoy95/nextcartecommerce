package com.mhjoy.nextcart.common.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when request parameters are syntactically valid but semantically invalid.
 *
 * <p>Maps to HTTP {@code 400 Bad Request}. Use this for invalid filters, sort values,
 * or incompatible parameter combinations.</p>
 */
public abstract class BadRequestException extends AppException {

    protected BadRequestException(String errorCode, String message) {
        super(HttpStatus.BAD_REQUEST, errorCode, message);
    }
}
