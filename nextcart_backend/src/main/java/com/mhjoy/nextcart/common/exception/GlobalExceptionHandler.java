package com.mhjoy.nextcart.common.exception;

import com.mhjoy.nextcart.common.response.CommonApiResponse;
import com.mhjoy.nextcart.common.storage.StorageException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;

/**
 * Centralised exception handler for all controllers.
 *
 * <p>Translates application and framework exceptions into structured
 * {@link CommonApiResponse} error payloads with appropriate HTTP status codes.
 * All unhandled exceptions fall through to the generic handler which returns
 * {@code 500 Internal Server Error}.</p>
 *
 * @author Mahadi Hasan Joy
 * @since 2026-04-09
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * Handles all domain-specific application exceptions.
     *
     * <p>The HTTP status and error code are read directly from the exception,
     * so every subclass of {@link AppException} is covered by this single handler.</p>
     */
    @ExceptionHandler(AppException.class)
    public ResponseEntity<CommonApiResponse<Void>> handleAppException(AppException ex) {
        log.warn("Application exception [{}]: {}", ex.getErrorCode(), ex.getMessage());
        return ResponseEntity
                .status(ex.getHttpStatus())
                .body(CommonApiResponse.error(ex.getErrorCode(), ex.getMessage()));
    }

    /**
     * Handles bean validation failures from {@code @Valid} on request bodies.
     *
     * <p>Field-level errors are collected into a {@code Map<field, message>} and
     * returned in the {@code details} field of the error response.</p>
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<CommonApiResponse<Void>> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        fieldError -> fieldError.getDefaultMessage() != null
                                ? fieldError.getDefaultMessage()
                                : "Invalid value",
                        (existing, duplicate) -> existing
                ));

        log.debug("Validation failed: {}", fieldErrors);
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(CommonApiResponse.error("VALIDATION_FAILED", "Request validation failed", fieldErrors));
    }

    /**
     * Handles constraint violations from {@code @Validated} on method parameters or path variables.
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<CommonApiResponse<Void>> handleConstraintViolation(ConstraintViolationException ex) {
        Map<String, String> violations = ex.getConstraintViolations()
                .stream()
                .collect(Collectors.toMap(
                        violation -> violation.getPropertyPath().toString(),
                        ConstraintViolation::getMessage,
                        (existing, duplicate) -> existing
                ));

        log.debug("Constraint violation: {}", violations);
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(CommonApiResponse.error("VALIDATION_FAILED", "Request validation failed", violations));
    }

    /**
     * Handles Spring Security authentication failures that bubble up past the filter chain.
     * The primary 401 path is handled by the authenticationEntryPoint in SecurityConfig;
     * this catches any that reach a controller.
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<CommonApiResponse<Void>> handleAuthenticationException(AuthenticationException ex) {
        log.debug("Authentication exception: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(CommonApiResponse.error("UNAUTHORIZED", "Authentication required"));
    }

    /**
     * Handles Spring Security access denied exceptions that bubble up past the filter chain.
     * The primary 403 path is handled by the accessDeniedHandler in SecurityConfig.
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<CommonApiResponse<Void>> handleAccessDeniedException(AccessDeniedException ex) {
        log.debug("Access denied: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(CommonApiResponse.error("FORBIDDEN", "You do not have permission to access this resource"));
    }

    /**
     * Handles unsupported HTTP methods (405). Returns JSON instead of an empty response.
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<CommonApiResponse<Void>> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
        log.debug("Method not allowed: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(CommonApiResponse.error("METHOD_NOT_ALLOWED",
                        "HTTP method '" + ex.getMethod() + "' is not supported for this endpoint"));
    }

    /**
     * Handles file upload validation errors (wrong type, size exceeded, S3 failures).
     */
    @ExceptionHandler(StorageException.class)
    public ResponseEntity<CommonApiResponse<Void>> handleStorageException(StorageException ex) {
        log.warn("Storage error: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(CommonApiResponse.error("STORAGE_ERROR", ex.getMessage()));
    }

    /**
     * Fallback handler for all unhandled exceptions.
     *
     * <p>Logs the full stack trace and returns a generic {@code 500} response
     * to avoid leaking internal details to the client.</p>
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<CommonApiResponse<Void>> handleException(Exception ex) {
        log.error("Unhandled exception", ex);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(CommonApiResponse.error("INTERNAL_SERVER_ERROR", "An unexpected error occurred"));
    }
}
