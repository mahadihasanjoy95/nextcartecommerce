package com.mhjoy.nextcart.auth.exception;

import com.mhjoy.nextcart.common.exception.AppException;
import org.springframework.http.HttpStatus;

public class PermissionNotFoundException extends AppException {

    public PermissionNotFoundException(Long id) {
        super(HttpStatus.NOT_FOUND, "PERMISSION_NOT_FOUND", "Permission not found with id: " + id);
    }

    public PermissionNotFoundException(String code) {
        super(HttpStatus.NOT_FOUND, "PERMISSION_NOT_FOUND", "Permission not found with code: " + code);
    }
}
