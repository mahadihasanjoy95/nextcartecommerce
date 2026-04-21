package com.mhjoy.nextcart.auth.exception;

import com.mhjoy.nextcart.common.exception.AppException;
import org.springframework.http.HttpStatus;

public class RoleNotFoundException extends AppException {

    public RoleNotFoundException(String name) {
        super(HttpStatus.NOT_FOUND, "ROLE_NOT_FOUND", "Role not found: " + name);
    }

    public RoleNotFoundException(Long id) {
        super(HttpStatus.NOT_FOUND, "ROLE_NOT_FOUND", "Role not found with id: " + id);
    }
}
