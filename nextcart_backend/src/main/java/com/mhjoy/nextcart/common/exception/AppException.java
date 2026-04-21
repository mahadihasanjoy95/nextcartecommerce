package com.mhjoy.nextcart.common.exception;

import org.springframework.http.HttpStatus;

/**
 * Base class for all application-level exceptions.
 *
 * <p>Subclasses define the HTTP status and error code. The {@link GlobalExceptionHandler}
 * intercepts any {@code AppException} and maps it to a structured {@code CommonApiResponse}
 * with the appropriate HTTP status.</p>
 *
 * @author Mahadi Hasan Joy
 * @since 2026-04-09
 */
public abstract class AppException extends RuntimeException {

    private final HttpStatus httpStatus;
    private final String errorCode;

    protected AppException(HttpStatus httpStatus, String errorCode, String message) {
        super(message);
        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
