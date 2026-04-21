package com.mhjoy.nextcart.auth.exception;

import com.mhjoy.nextcart.common.exception.AppException;
import org.springframework.http.HttpStatus;

public class UserAlreadyExistsException extends AppException {

    public UserAlreadyExistsException(String message) {
        super(HttpStatus.CONFLICT, "USER_ALREADY_EXISTS", message);
    }
}
