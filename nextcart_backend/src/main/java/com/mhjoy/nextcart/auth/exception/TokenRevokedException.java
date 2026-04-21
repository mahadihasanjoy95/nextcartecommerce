package com.mhjoy.nextcart.auth.exception;

import com.mhjoy.nextcart.common.exception.AppException;
import org.springframework.http.HttpStatus;

public class TokenRevokedException extends AppException {

    public TokenRevokedException() {
        super(HttpStatus.UNAUTHORIZED, "TOKEN_REVOKED", "Token has been revoked");
    }
}
