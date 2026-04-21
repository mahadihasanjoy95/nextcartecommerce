package com.mhjoy.nextcart.auth.exception;

import com.mhjoy.nextcart.common.exception.AppException;
import org.springframework.http.HttpStatus;

public class InvalidCredentialsException extends AppException {

    public InvalidCredentialsException() {
        super(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "Invalid email or password");
    }
}
