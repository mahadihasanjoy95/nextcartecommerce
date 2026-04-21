package com.mhjoy.nextcart.common.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when an operation conflicts with the current state of a resource.
 *
 * <p>Maps to HTTP {@code 409 Conflict}. Domain modules extend this class
 * and supply a specific error code and message.</p>
 *
 * @author Mahadi Hasan Joy
 * @since 2026-04-09
 */
public abstract class ConflictException extends AppException {

    protected ConflictException(String errorCode, String message) {
        super(HttpStatus.CONFLICT, errorCode, message);
    }
}
