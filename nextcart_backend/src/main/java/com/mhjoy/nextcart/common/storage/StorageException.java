package com.mhjoy.nextcart.common.storage;

/**
 * Thrown when a file upload, deletion, or URL-build operation fails.
 *
 * <p>Handled by {@link com.mhjoy.nextcart.common.exception.GlobalExceptionHandler}
 * which maps it to HTTP 400 Bad Request.</p>
 */
public class StorageException extends RuntimeException {

    public StorageException(String message) {
        super(message);
    }

    public StorageException(String message, Throwable cause) {
        super(message, cause);
    }
}
