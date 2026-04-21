package com.mhjoy.nextcart.auth.exception;

import com.mhjoy.nextcart.common.exception.AppException;
import org.springframework.http.HttpStatus;

public class TokenExpiredException extends AppException {

    public TokenExpiredException() {
        super(HttpStatus.UNAUTHORIZED, "TOKEN_EXPIRED", "Token has expired");
    }
}
