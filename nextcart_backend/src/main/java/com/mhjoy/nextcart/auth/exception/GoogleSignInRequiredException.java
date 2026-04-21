package com.mhjoy.nextcart.auth.exception;

import com.mhjoy.nextcart.common.exception.AppException;
import org.springframework.http.HttpStatus;

public class GoogleSignInRequiredException extends AppException {

    public GoogleSignInRequiredException() {
        super(HttpStatus.UNAUTHORIZED, "GOOGLE_SIGN_IN_REQUIRED",
                "This account was created with Google. Please sign in with Google.");
    }
}
