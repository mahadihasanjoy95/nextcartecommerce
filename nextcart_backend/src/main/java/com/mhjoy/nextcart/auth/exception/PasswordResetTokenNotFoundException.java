package com.mhjoy.nextcart.auth.exception;

import com.mhjoy.nextcart.common.exception.AppException;
import org.springframework.http.HttpStatus;

public class PasswordResetTokenNotFoundException extends AppException {

    public PasswordResetTokenNotFoundException() {
        super(HttpStatus.BAD_REQUEST, "INVALID_RESET_TOKEN",
                "The password reset link is invalid or has already been used.");
    }
}
