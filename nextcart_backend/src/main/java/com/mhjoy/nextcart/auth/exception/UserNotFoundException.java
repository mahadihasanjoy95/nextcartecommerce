package com.mhjoy.nextcart.auth.exception;

import com.mhjoy.nextcart.common.exception.AppException;
import org.springframework.http.HttpStatus;

public class UserNotFoundException extends AppException {

    public UserNotFoundException(Long id) {
        super(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User not found with id: " + id);
    }

    public UserNotFoundException(String identifier) {
        super(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User not found: " + identifier);
    }
}
