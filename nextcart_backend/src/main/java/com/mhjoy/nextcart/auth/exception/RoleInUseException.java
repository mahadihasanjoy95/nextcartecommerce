package com.mhjoy.nextcart.auth.exception;

import com.mhjoy.nextcart.common.exception.ConflictException;

public class RoleInUseException extends ConflictException {

    public RoleInUseException(String roleName) {
        super("ROLE_IN_USE", "Role '" + roleName + "' cannot be deleted because it is assigned to one or more users");
    }
}
