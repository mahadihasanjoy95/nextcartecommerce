package com.mhjoy.nextcart.auth.exception;

import com.mhjoy.nextcart.common.exception.ConflictException;

public class RoleAlreadyExistsException extends ConflictException {

    public RoleAlreadyExistsException(String name) {
        super("ROLE_ALREADY_EXISTS", "Role with name '" + name + "' already exists");
    }
}
