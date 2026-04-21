package com.mhjoy.nextcart.common.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when a requested resource does not exist.
 *
 * <p>Maps to HTTP {@code 404 Not Found}. Domain modules extend this class
 * and supply a specific error code and message.</p>
 *
 * @author Mahadi Hasan Joy
 * @since 2026-04-09
 */
public abstract class ResourceNotFoundException extends AppException {

    protected ResourceNotFoundException(String errorCode, String message) {
        super(HttpStatus.NOT_FOUND, errorCode, message);
    }
}
