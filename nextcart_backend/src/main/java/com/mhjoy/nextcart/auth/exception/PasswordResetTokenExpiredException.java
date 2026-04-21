package com.mhjoy.nextcart.auth.exception;

import com.mhjoy.nextcart.common.exception.AppException;
import org.springframework.http.HttpStatus;

public class PasswordResetTokenExpiredException extends AppException {

    public PasswordResetTokenExpiredException() {
        super(HttpStatus.BAD_REQUEST, "RESET_TOKEN_EXPIRED",
                "The password reset link has expired. Please request a new one.");
    }
}
