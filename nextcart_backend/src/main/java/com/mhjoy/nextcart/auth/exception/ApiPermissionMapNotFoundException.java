package com.mhjoy.nextcart.auth.exception;

import com.mhjoy.nextcart.common.exception.AppException;
import org.springframework.http.HttpStatus;

public class ApiPermissionMapNotFoundException extends AppException {

    public ApiPermissionMapNotFoundException(Long id) {
        super(HttpStatus.NOT_FOUND, "API_MAP_NOT_FOUND", "API permission mapping not found with id: " + id);
    }
}
