package com.mhjoy.nextcart.auth.exception;

import com.mhjoy.nextcart.common.exception.ConflictException;

public class ProtectedRoleDeletionException extends ConflictException {

    public ProtectedRoleDeletionException(String roleName) {
        super("ROLE_PROTECTED", "Role '" + roleName + "' is protected and cannot be deleted");
    }
}
